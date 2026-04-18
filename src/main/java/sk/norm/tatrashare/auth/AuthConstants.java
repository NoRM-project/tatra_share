package sk.norm.tatrashare.auth;

/**
 * MVP stand-in for authentication.
 * <p>
 * Until we implement real auth (e.g. JWT + SecurityContext), the backend behaves as if every
 * request is made by the same "current" user.
 */
public final class AuthConstants {

    /**
     * Simulated authenticated user id.
     */
    public static final Long HARD_CODED_CURRENT_USER_ID = 1L;

    private AuthConstants() {
    }
}

