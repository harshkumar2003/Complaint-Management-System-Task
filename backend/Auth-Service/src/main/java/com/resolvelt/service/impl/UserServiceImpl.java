package com.resolvelt.service.impl;

import com.resolvelt.DTO.Request.LoginRequest;
import com.resolvelt.DTO.Request.RegisterRequest;
import com.resolvelt.DTO.Response.LoginResponse;
import com.resolvelt.exception.EmailAlredayExists;
import com.resolvelt.exception.InvalidCredentialsException;
import com.resolvelt.model.User;
import com.resolvelt.repo.UserRepo;
import com.resolvelt.security.JwtUtil;
import com.resolvelt.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public void register(RegisterRequest registerRequest) {

        if (userRepo.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlredayExists("Email is already registered");
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(
                passwordEncoder.encode(registerRequest.getPassword())
        );
        user.setRole("USER");

        userRepo.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest)
    {
        User user = userRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(()-> new InvalidCredentialsException("Invalid email or password"));
        if(!passwordEncoder.matches(loginRequest.getPassword(),user.getPassword()))
        {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(
                user.getId(),
                user.getRole()
        );

        return new LoginResponse(token,user.getRole(),user.getId());


    }
}
