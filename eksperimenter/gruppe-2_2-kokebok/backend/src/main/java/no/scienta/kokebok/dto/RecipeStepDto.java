package no.scienta.kokebok.dto;

public class RecipeStepDto {
    private Long id;
    private int stepNumber;
    private String instruction;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getStepNumber() { return stepNumber; }
    public void setStepNumber(int stepNumber) { this.stepNumber = stepNumber; }

    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }
}
