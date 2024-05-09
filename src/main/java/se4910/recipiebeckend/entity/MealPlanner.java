package se4910.recipiebeckend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;


@Getter
@Setter
@Entity(name = "mealPlanner")
@Table(name = "mealPlanner")
@Data
public class MealPlanner {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    String monday;
    String tuesday;
    String wednesday;
    String thursday;
    String friday;
    String saturday;
    String sunday;

    String savedWeek;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="users_id", nullable=false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

}
