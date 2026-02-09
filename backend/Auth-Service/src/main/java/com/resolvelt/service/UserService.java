package com.resolvelt.service;

import com.resolvelt.DTO.Request.LoginRequest;
import com.resolvelt.DTO.Request.RegisterRequest;
import com.resolvelt.DTO.Response.LoginResponse;

public interface UserService
{
    void register(RegisterRequest registerRequest);
    LoginResponse login(LoginRequest loginRequest);
}
