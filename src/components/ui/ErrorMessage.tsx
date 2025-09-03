interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div data-cy="page-error">
      <h2>{message}</h2>
    </div>
  );
};

export default ErrorMessage;
