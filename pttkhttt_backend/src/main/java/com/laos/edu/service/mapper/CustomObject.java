package com.laos.edu.service.mapper;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class CustomObject {
    private String message;
    private Object data;
    private int status;
}
