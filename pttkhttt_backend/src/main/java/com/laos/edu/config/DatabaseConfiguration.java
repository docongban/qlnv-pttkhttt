package com.laos.edu.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableJpaRepositories("com.laos.edu.repository")
@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
@EnableTransactionManagement
public class DatabaseConfiguration {

//    @Bean
//    @Primary
//    @ConfigurationProperties("spring.datasource.db-shool")
//    public DataSourceProperties dataSourceProperties() {
//        return new DataSourceProperties();
//    }
//
////    @Bean
////    @Primary
////    @ConfigurationProperties("spring.datasource.db-shool.configuration")
////    public HikariDataSource firstDataSource(DataSourceProperties firstDataSourceProperties) {
////        return firstDataSourceProperties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
////    }
//
//    @Bean
//    @ConfigurationProperties("spring.datasource.db-unitel")
//    public HikariDataSource dataSource(DataSourceProperties properties) {
//        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
//    }
//    @Bean
//    @Primary
//    @ConfigurationProperties(prefix = "spring.datasource.hikari")
//    public HikariConfig hikariConfig() {
//        return new HikariConfig();
//    }
//
//    @Bean
//    public DataSource dataSource() {
//        return new HikariDataSource(hikariConfig());
//    }
}
