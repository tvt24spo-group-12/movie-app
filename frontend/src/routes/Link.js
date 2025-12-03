import { useRouter } from "./useRouter";

/**
 * Simple Link component for navigation
 * Usage: <Link to="/movies">Movies</Link>
 */
export default function Link({ to, children, className, ...props }) {
  const { navigate } = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

