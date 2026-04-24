package no.scienta.kokebok.dto;

import java.util.List;

public class MenuResponse {
    private List<RecipeDto> dishes;
    private int totalTimeMinutes;

    public MenuResponse(List<RecipeDto> dishes, int totalTimeMinutes) {
        this.dishes = dishes;
        this.totalTimeMinutes = totalTimeMinutes;
    }

    public List<RecipeDto> getDishes() { return dishes; }
    public int getTotalTimeMinutes() { return totalTimeMinutes; }
}
