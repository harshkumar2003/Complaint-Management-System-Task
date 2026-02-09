package com.resolvelt.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Configuration

public class JwtConfig
{
    private final SecretKey key;
    private final long expirationTime;

    public JwtConfig(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationTime)
    {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationTime = expirationTime;
    }

    public SecretKey getKey() {
        return key;
    }

    public long getExpirationTime() {
        return expirationTime;
    }
}
