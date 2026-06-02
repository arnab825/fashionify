package com.fashionify.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * One-time schema migration to remove legacy columns that are no longer
 * part of the JPA entity model.
 */
@Component
@Order(1)
public class SchemaMigration implements ApplicationRunner {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public void run(ApplicationArguments args) {
        dropColumnIfExists("products", "total_stock");
        dropColumnIfExists("products", "image");
    }

    private void dropColumnIfExists(String table, String column) {
        try {
            // Check if column exists
            Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
                Integer.class, table, column
            );
            if (count != null && count > 0) {
                jdbc.execute("ALTER TABLE `" + table + "` DROP COLUMN `" + column + "`");
                System.out.println("🔧 Dropped legacy column: " + table + "." + column);
            }
        } catch (Exception e) {
            System.out.println("⚠️  Could not drop " + table + "." + column + ": " + e.getMessage());
        }
    }
}
