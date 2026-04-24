package no.scienta.kokebok.repository;

import jakarta.persistence.criteria.*;
import no.scienta.kokebok.domain.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class RecipeSpecification {

    public static Specification<Recipe> withFilters(
            String q,
            Category category,
            Cuisine cuisine,
            Set<FlavorTag> flavors,
            String ingredient
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                predicates.add(cb.or(titleMatch, descMatch));
            }

            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (cuisine != null) {
                predicates.add(cb.equal(root.get("cuisine"), cuisine));
            }

            if (flavors != null && !flavors.isEmpty()) {
                for (FlavorTag flavor : flavors) {
                    predicates.add(cb.isMember(flavor, root.get("flavorTags")));
                }
            }

            if (ingredient != null && !ingredient.isBlank()) {
                String pattern = "%" + ingredient.toLowerCase() + "%";
                Subquery<Long> sub = query.subquery(Long.class);
                Root<Ingredient> ingRoot = sub.from(Ingredient.class);
                sub.select(ingRoot.get("recipe").get("id"))
                   .where(
                       cb.equal(ingRoot.get("recipe").get("id"), root.get("id")),
                       cb.like(cb.lower(ingRoot.get("name")), pattern)
                   );
                predicates.add(cb.exists(sub));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
