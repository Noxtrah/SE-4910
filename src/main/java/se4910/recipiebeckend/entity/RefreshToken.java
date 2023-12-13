package se4910.recipiebeckend.entity;
import java.util.Date;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;


@Entity(name="refresh_token")
@Table(name="refresh_token")
@Data
public class RefreshToken {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="users_id", nullable=false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnore
	User user;
	
	@Column(nullable = false, unique = true)
	String token;
	
	@Column(nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	Date expiryDate;
}
