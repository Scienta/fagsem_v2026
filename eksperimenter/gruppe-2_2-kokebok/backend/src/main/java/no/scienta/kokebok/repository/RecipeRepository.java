package no.scienta.kokebok.repository;

import no.scienta.kokebok.domain.Recipe;
import no.scienta.kokebok.domain.RecipeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long>, JpaSpecificationExecutor<Recipe> {

    List<Recipe> findByCategory(RecipeCategory category);

    @Query("SELECT DISTINCT r.cuisine FROM Recipe r WHERE r.cuisine IS NOT NULL ORDER BY r.cuisine")
    List<String> findDistinctCuisines();
}
