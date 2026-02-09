package com.resolvelt.exception;

public class EmailAlredayExists extends RuntimeException
{
    public EmailAlredayExists(String message) {
        super(message);
    }
}
