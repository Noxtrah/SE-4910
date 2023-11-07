package se4910.recipiebeckend.request;

import lombok.Data;

@Data
public class RefreshRequest {
	Long userId; // kullanmayabiliriz
	String refreshToken;
}
