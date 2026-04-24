package no.scienta.kokebok.dto;

import java.util.HashMap;
import java.util.Map;

public class MenuRequest {
    private Map<String, Long> categorySelections = new HashMap<>();

    public Map<String, Long> getCategorySelections() { return categorySelections; }
    public void setCategorySelections(Map<String, Long> categorySelections) { this.categorySelections = categorySelections; }
}
