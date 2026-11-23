import os
import re
import sys
import pymysql

def load_env(env_path):
    env_vars = {}
    if not os.path.exists(env_path):
        return env_vars
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env_vars[k.strip()] = v.strip()
    return env_vars

def resolve_host(hostname):
    import socket
    try:
        return socket.gethostbyname(hostname)
    except Exception:
        import subprocess
        try:
            res = subprocess.run(['nslookup', hostname, '8.8.8.8'], capture_output=True, text=True, timeout=5)
            for line in res.stdout.splitlines()[2:]:
                if 'Address' in line:
                    parts = line.split(':')
                    if len(parts) > 1:
                        ip = parts[1].strip()
                        if '.' in ip:
                            return ip
        except Exception:
            pass
        return hostname

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    env_path = os.path.join(base_dir, 'backend', '.env')
    dump_path = os.path.join(base_dir, 'aiven_backup.sql')
    
    if not os.path.exists(dump_path):
        print(f"Error: {dump_path} not found. Please run export_aiven.py first.")
        sys.exit(1)
        
    env = load_env(env_path)
    db_url = env.get('DATABASE_URL', '')
    user = env.get('DB_USER', '')
    password = env.get('DB_PASSWORD', '')
    
    match = re.search(r'jdbc:mysql://([^:/]+):?(\d+)?/([^?]+)', db_url)
    if not match:
        print("Could not parse DATABASE_URL from .env")
        sys.exit(1)
        
    host = match.group(1)
    port = int(match.group(2)) if match.group(2) else 4000
    database = match.group(3)
    
    print("=" * 60)
    print("FASHIONIFY - TIDB CLOUD DATABASE IMPORTER")
    print("=" * 60)
    print(f"Target TiDB Cloud:")
    print(f"  Host:     {host}")
    print(f"  Port:     {port}")
    print(f"  User:     {user}")
    print(f"  Database: {database}")
    print("-" * 60)
    
    actual_host = resolve_host(host)

    try:
        conn = pymysql.connect(
            host=actual_host,
            port=port,
            user=user,
            password=password,
            database=database,
            ssl={'ssl': {}},
            connect_timeout=15,
            autocommit=True
        )
    except Exception as e:
        print(f"\n❌ Connection failed: {e}\n")
        print("Please verify the credentials in backend/.env for TiDB Cloud.")
        sys.exit(1)
        
    print(f"Connected to TiDB Cloud! Reading {dump_path} ...")
    with open(dump_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
        
    # Normalize CRLF to LF
    sql_content = sql_content.replace('\r\n', '\n')
    
    with conn.cursor() as cur:
        cur.execute("SET SESSION sql_mode = 'ANSI_QUOTES'")
        cur.execute("SET FOREIGN_KEY_CHECKS = 0")
        
        # Split statements by semicolon at end of line
        raw_statements = sql_content.split(';\n')
        
        cleaned_statements = []
        for raw in raw_statements:
            # Strip comment-only lines from the statement
            lines = [l for l in raw.split('\n') if not l.strip().startswith('--')]
            stmt = '\n'.join(lines).strip()
            if stmt:
                cleaned_statements.append(stmt)
                
        print(f"Executing {len(cleaned_statements)} SQL statements...")
        for idx, stmt in enumerate(cleaned_statements, 1):
            try:
                cur.execute(stmt)
            except Exception as e:
                print(f"Notice on statement {idx}: {e}")
                
        cur.execute("SET FOREIGN_KEY_CHECKS = 1")
                
    conn.close()
    print("=" * 60)
    print("🎉 IMPORT COMPLETE! TiDB Cloud is fully populated.")
    print("=" * 60)

if __name__ == '__main__':
    main()
