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
    
    if not os.path.exists(env_path):
        print(f"Error: {env_path} not found.")
        sys.exit(1)
        
    env = load_env(env_path)
    
    db_url = env.get('DATABASE_URL', '')
    user = env.get('DB_USER', 'avnadmin')
    password = env.get('DB_PASSWORD', '')
    
    # Parse jdbc:mysql://host:port/database?params
    match = re.search(r'jdbc:mysql://([^:/]+):?(\d+)?/([^?]+)', db_url)
    if not match:
        print("Could not parse DATABASE_URL from .env")
        sys.exit(1)
        
    host = match.group(1)
    port = int(match.group(2)) if match.group(2) else 3306
    database = match.group(3)
    
    print("=" * 60)
    print("FASHIONIFY - AIVEN DATABASE EXPORTER")
    print("=" * 60)
    print(f"Connecting to Aiven MySQL:")
    print(f"  Host:     {host}")
    print(f"  Port:     {port}")
    print(f"  User:     {user}")
    print(f"  Database: {database}")
    print("-" * 60)
    
    actual_host = resolve_host(host)
    if actual_host != host:
        print(f"  Resolved: {actual_host} (via public DNS fallback)")

    try:
        conn = pymysql.connect(
            host=actual_host,
            port=port,
            user=user,
            password=password,
            database=database,
            ssl={'ssl': {}},
            connect_timeout=15
        )
    except Exception as e:
        print(f"\n❌ Connection failed: {e}\n")
        print("💡 NOTE:")
        print("If your Aiven dashboard shows status 'Rebuilding', the instance is currently waking up.")
        print("Please check your Aiven console. Once the status badge turns to 'Running' (Green),")
        print("re-run this script with: python scripts/export_aiven.py\n")
        sys.exit(1)
        
    output_file = os.path.join(base_dir, 'aiven_backup.sql')
    print(f"Connected successfully! Exporting to {output_file} ...")
    
    with conn.cursor() as cur, open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Fashionify Database Backup from Aiven MySQL\n")
        f.write("SET FOREIGN_KEY_CHECKS = 0;\n\n")
        
        cur.execute("SHOW TABLES")
        tables = [row[0] for row in cur.fetchall()]
        print(f"Found {len(tables)} tables: {', '.join(tables)}")
        
        for table in tables:
            print(f"Exporting table: {table} ...")
            f.write(f"-- Table structure for `{table}`\n")
            f.write(f"DROP TABLE IF EXISTS `{table}`;\n")
            
            cur.execute(f"SHOW CREATE TABLE `{table}`")
            create_stmt = cur.fetchone()[1]
            f.write(f"{create_stmt};\n\n")
            
            # Export data
            cur.execute(f"SELECT * FROM `{table}`")
            rows = cur.fetchall()
            if rows:
                f.write(f"-- Data for table `{table}`\n")
                # Fetch column names
                cur.execute(f"DESCRIBE `{table}`")
                columns = [col[0] for col in cur.fetchall()]
                cols_str = ", ".join([f"`{c}`" for c in columns])
                
                f.write(f"INSERT INTO `{table}` ({cols_str}) VALUES\n")
                row_lines = []
                for row in rows:
                    values = []
                    for val in row:
                        if val is None:
                            values.append("NULL")
                        elif isinstance(val, (int, float)):
                            values.append(str(val))
                        elif isinstance(val, bytes):
                            values.append(f"0x{val.hex()}")
                        elif isinstance(val, bool):
                            values.append("1" if val else "0")
                        else:
                            escaped = pymysql.converters.escape_string(str(val))
                            values.append(f"'{escaped}'")
                    row_lines.append(f"({', '.join(values)})")
                f.write(",\n".join(row_lines) + ";\n\n")
                
        f.write("SET FOREIGN_KEY_CHECKS = 1;\n")
        
    conn.close()
    print("=" * 60)
    print(f"🎉 EXPORT COMPLETE! Saved to: {output_file}")
    print("=" * 60)

if __name__ == '__main__':
    main()
