package com.centerport.transaction;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request body for voiding a settled transaction. A reason is required and
 * recorded on the transaction for the audit trail.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoidRequest {

    @NotBlank(message = "reason must not be blank")
    private String reason;
}
