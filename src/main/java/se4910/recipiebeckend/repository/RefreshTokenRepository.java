package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.RefreshToken;
import se4910.recipiebeckend.entity.User;


@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{

	RefreshToken findByUserId(Long userId);
	RefreshToken findByToken(String token);

	RefreshToken findByUser(User user);

}
