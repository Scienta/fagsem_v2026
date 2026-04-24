package no.scienta.kokebok.repository;

import no.scienta.kokebok.domain.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Long> {}
