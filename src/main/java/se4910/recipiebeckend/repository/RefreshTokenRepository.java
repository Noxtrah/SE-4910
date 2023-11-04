package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se4910.recipiebeckend.entity.RefreshToken;


public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{

	RefreshToken findByUserId(Long userId);
	
}
