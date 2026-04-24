package no.scienta.kokebok.repository;

import no.scienta.kokebok.domain.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class RecipeRepositoryTest {

    @Autowired
    private RecipeRepository recipeRepository;

    private Recipe pasta;
    private Recipe farikal;
    private Recipe sushi;

    @BeforeEach
    void setUp() {
        recipeRepository.deleteAll();

        pasta = new Recipe();
        pasta.setTitle("Pasta Carbonara");
        pasta.setDescription("Klassisk italiensk pastarett");
        pasta.setCuisine("Italiensk");
        pasta.setCategory(RecipeCategory.HOVEDRETT);
        pasta.setFlavorTags(Set.of(FlavorTag.SALTY, FlavorTag.UMAMI));
        pasta.setPrepTimeMinutes(10);
        pasta.setCookTimeMinutes(20);

        Ingredient egg = new Ingredient();
        egg.setName("Egg");
        egg.setSortOrder(0);
        egg.setRecipe(pasta);
        pasta.getIngredients().add(egg);

        Ingredient bacon = new Ingredient();
        bacon.setName("Bacon");
        bacon.setSortOrder(1);
        bacon.setRecipe(pasta);
        pasta.getIngredients().add(bacon);

        farikal = new Recipe();
        farikal.setTitle("Fårikål");
        farikal.setDescription("Norsk nasjonalrett med får og kål");
        farikal.setCuisine("Norsk");
        farikal.setCategory(RecipeCategory.HOVEDRETT);
        farikal.setFlavorTags(Set.of(FlavorTag.MILD, FlavorTag.SALTY));

        Ingredient lam = new Ingredient();
        lam.setName("Lammekjøtt");
        lam.setSortOrder(0);
        lam.setRecipe(farikal);
        farikal.getIngredients().add(lam);

        sushi = new Recipe();
        sushi.setTitle("Laksesushi");
        sushi.setDescription("Frisk sushi med norsk laks");
        sushi.setCuisine("Japansk");
        sushi.setCategory(RecipeCategory.FORRETT);
        sushi.setFlavorTags(Set.of(FlavorTag.SOUR, FlavorTag.UMAMI, FlavorTag.MILD));

        recipeRepository.saveAll(List.of(pasta, farikal, sushi));
    }

    @Test
    void findAll_returnsAllRecipes() {
        assertThat(recipeRepository.findAll()).hasSize(3);
    }

    @Test
    void search_byTitleKeyword_returnsMatchingRecipes() {
        Specification<Recipe> spec = RecipeSpecification.hasTitle("pasta");
        List<Recipe> result = recipeRepository.findAll(spec);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Pasta Carbonara");
    }

    @Test
    void search_byDescriptionKeyword_returnsMatchingRecipes() {
        Specification<Recipe> spec = RecipeSpecification.hasTitle("norsk");
        List<Recipe> result = recipeRepository.findAll(spec);
        assertThat(result).hasSize(2);
    }

    @Test
    void search_byCuisine_returnsMatchingRecipes() {
        Specification<Recipe> spec = RecipeSpecification.hasCuisine("Italiensk");
        List<Recipe> result = recipeRepository.findAll(spec);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Pasta Carbonara");
    }

    @Test
    void search_byCuisine_isCaseInsensitive() {
        Specification<Recipe> spec = RecipeSpecification.hasCuisine("italiensk");
        List<Recipe> result = recipeRepository.findAll(spec);
        assertThat(result).hasSize(1);
    }

    @Test
    void search_byCategory_returnsMatchingRecipes() {
        Specification<Recipe> spec = RecipeSpecification.hasCategory(RecipeCategory.FORRETT);
        List<Recipe> result = recipeRepository.findAll(spec);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Laksesushi");
    }

    @Test
    void search_byIngredient_returnsMatchingRecipes() {
        Specification<Recipe> spec = RecipeSpecification.hasIngredient("egg");
        List<Recipe> result = recipeRepository.findAll(spec);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Pasta Carbonara");
    }

    @Test
    void search_byFlavorTag_returnsMatchingRecipes() {
        Specification<Recipe> spec = RecipeSpecification.hasFlavorTags(Set.of(FlavorTag.UMAMI));
        List<Recipe> result = recipeRepository.findAll(spec);
        assertThat(result).hasSize(2);
    }

    @Test
    void search_combinedFilters_returnsNarrowedResults() {
        Specification<Recipe> spec = Specification
                .where(RecipeSpecification.hasCategory(RecipeCategory.HOVEDRETT))
                .and(RecipeSpecification.hasCuisine("Norsk"));
        List<Recipe> result = recipeRepository.findAll(spec);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Fårikål");
    }

    @Test
    void search_byIngredientPartialMatch_returnsRecipe() {
        Specification<Recipe> spec = RecipeSpecification.hasIngredient("lam");
        List<Recipe> result = recipeRepository.findAll(spec);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Fårikål");
    }

    @Test
    void findDistinctCuisines_returnsAllUniqueCuisines() {
        List<String> cuisines = recipeRepository.findDistinctCuisines();
        assertThat(cuisines).containsExactlyInAnyOrder("Italiensk", "Norsk", "Japansk");
    }
}
