import CircularProgress from '@mui/material/CircularProgress';

export function ForgotPasswordLinkView() {
    return (
      <div style={{textAlign: 'center'}}>
        <h2>Hey 👋, Check your mail to get link to reset your Password!</h2>
        <CircularProgress size="3rem" />
      </div>
    );
}