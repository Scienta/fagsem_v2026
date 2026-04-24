package no.scienta.kokebok.repository;

import no.scienta.kokebok.domain.FlavorTag;
import no.scienta.kokebok.domain.Ingredient;
import no.scienta.kokebok.domain.Recipe;
import no.scienta.kokebok.domain.RecipeCategory;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.JoinType;
import java.util.Set;

public class RecipeSpecification {

    public static Specification<Recipe> hasTitle(String q) {
        return (root, query, cb) -> {
            String pattern = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
            );
        };
    }

    public static Specification<Recipe> hasCuisine(String cuisine) {
        return (root, query, cb) ->
                cb.equal(cb.lower(root.get("cuisine")), cuisine.toLowerCase());
    }

    public static Specification<Recipe> hasCategory(RecipeCategory category) {
        return (root, query, cb) ->
                cb.equal(root.get("category"), category);
    }

    public static Specification<Recipe> hasIngredient(String name) {
        return (root, query, cb) -> {
            var join = root.join("ingredients", JoinType.INNER);
            query.distinct(true);
            return cb.like(cb.lower(join.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<Recipe> hasFlavorTags(Set<FlavorTag> tags) {
        return (root, query, cb) -> {
            var join = root.join("flavorTags", JoinType.INNER);
            query.distinct(true);
            return join.in(tags);
        };
    }
}
