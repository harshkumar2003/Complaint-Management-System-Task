package com.resolvelt.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintRequest {

    private String title;
    private String description;
    private Long userId;
}
