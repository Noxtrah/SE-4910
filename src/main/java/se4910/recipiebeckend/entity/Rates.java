package se4910.recipiebeckend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity(name = "rates")
@Table(name = "rates")
@Data
public class Rates {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


   // @Column(columnDefinition = "rate")
    int rate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="recipe_id", nullable=true)
    @OnDelete(action = OnDeleteAction.CASCADE)
 //   @JsonIgnore
    private Recipe recipe;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_recipes_id", nullable=true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private UserRecipes userRecipes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="users_id", nullable=false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    public void setId(Long id) {
        this.id = id;
    }


    public Long getId() {
        return id;
    }
}
