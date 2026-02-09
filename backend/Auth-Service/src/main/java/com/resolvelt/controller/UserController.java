package com.resolvelt.controller;

import com.resolvelt.DTO.Request.LoginRequest;
import com.resolvelt.DTO.Request.RegisterRequest;
import com.resolvelt.DTO.Response.LoginResponse;
import com.resolvelt.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class UserController
{
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest registerRequest)
    {
        userService.register(registerRequest);
        return ResponseEntity.ok("User Register");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest)
    {
        LoginResponse loginResponse = userService.login(loginRequest);
        return ResponseEntity.status(200).body(loginResponse);
    }

}
