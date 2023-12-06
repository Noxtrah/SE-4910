package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.Favorites;


import java.util.List;
import java.util.Optional;

@Repository

public  interface FavoritesRepository extends JpaRepository<Favorites, Long>
{
    @Override
    Optional<Favorites> findById(Long userId);

    @Override
    List<Favorites> findAll();
}
