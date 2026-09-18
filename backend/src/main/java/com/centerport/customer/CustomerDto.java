package com.centerport.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Read-only customer view over a {@link com.centerport.profile.SeafarerProfile},
 * consumed by the transaction workspace's customer selector.
 *
 * A "customer" in the billing domain is a seafarer profile: the display name is
 * the combined first/last name, the application number maps to the profile's
 * business ID, and the agency maps to the profile's employer.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {

    private UUID id;
    private String name;
    private String applicationNo;
    private String agency;
}
