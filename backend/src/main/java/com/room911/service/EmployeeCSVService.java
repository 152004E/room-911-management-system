package com.room911.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.room911.dto.EmployeeCSVRecord;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class EmployeeCSVService {

    public static List<EmployeeCSVRecord> parseCSV(MultipartFile file) throws IOException, CsvException {
        List<EmployeeCSVRecord> records = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> allData = reader.readAll();

            // Skip header row
            for (int i = 1; i < allData.size(); i++) {
                String[] line = allData.get(i);

                if (line.length < 5) {
                    continue;
                }

                EmployeeCSVRecord record = new EmployeeCSVRecord();
                record.setFirstName(line[0].trim());
                record.setLastName(line[1].trim());
                record.setEmail(line[2].trim());
                record.setPhoneNumber(line[3].trim().isEmpty() ? null : line[3].trim());

                try {
                    record.setDepartmentId(Long.parseLong(line[4].trim()));
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Row " + (i + 1) + ": Department ID must be a number");
                }

                // is_authorized defaults to true if not specified
                if (line.length > 5) {
                    String authValue = line[5].trim().toLowerCase();
                    record.setIsAuthorized("true".equals(authValue) || "yes".equals(authValue) || "1".equals(authValue));
                } else {
                    record.setIsAuthorized(true);
                }

                records.add(record);
            }
        }

        return records;
    }
}
