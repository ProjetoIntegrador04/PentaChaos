package projeto_integrador.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "clock_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClockEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String tipo; // ENTRY, EXIT, LUNCH_START, LUNCH_END

    private LocalDateTime timestamp;

    @Column(nullable = false)
    private Float latitude;

    @Column(nullable = false)
    private Float longitude;

    @Column(nullable = false)
    private Float precisao;

    @Column(nullable = false)
    private String fonte; // WEB, MOBILE_ANDROID, MOBILE_IOS

    @Column(nullable = false)
    private String deviceId;

    private String ip;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;
}


