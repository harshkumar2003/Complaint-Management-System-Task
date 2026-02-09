package com.resolvelt.security;

import com.resolvelt.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
@AllArgsConstructor

public class JwtUtil
{
    private final JwtConfig jwtConfig;

    public String generateToken(UUID id, String role)
    {
        return Jwts.builder()
                .setSubject(id.toString())
                .claim("role",role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+jwtConfig.getExpirationTime()))
                .signWith(jwtConfig.getKey(), SignatureAlgorithm.HS256)
                .compact();

    }

    public Claims parseClaims(String token)
    {
        return Jwts.parserBuilder()
                .setSigningKey(jwtConfig.getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }
    public boolean ValidateToken(String token)
    {
        try {
            parseClaims(token);
            return true;
        }
        catch (JwtException | IllegalArgumentException e)
        {
            return false;
        }
    }
    public UUID extractId(String token)
    {
        return UUID.fromString(parseClaims(token).getSubject());
    }
    public String extractRole(String token)
    {
        return parseClaims(token).get("role",String.class);
    }

}
