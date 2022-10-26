package com.laos.edu.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SmsDTO {
    private String phoneNumber;
    private String content;
    private long languageId;
}
