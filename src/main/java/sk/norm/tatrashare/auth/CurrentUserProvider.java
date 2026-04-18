package sk.norm.tatrashare.auth;

import org.springframework.stereotype.Component;

/**
 * Provides the id of the "current" user.
 * <p>
 * In a real auth system this would read from the token / SecurityContext.
 */
@Component
public class CurrentUserProvider {

    public Long getCurrentUserId() {
        return AuthConstants.HARD_CODED_CURRENT_USER_ID;
    }
}

