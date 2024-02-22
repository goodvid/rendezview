import { useNavigate} from "react-router-dom";

export function withAuth(Component) {
  return function WithAuth(props) {
    const navigate = useNavigate();
    
    // Add your authentication logic here
    // For example, check if the user is authenticated
    

    // Redirect to login page if not authenticated
    
    fetch("http://localhost:5000/check_user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
      
    }).then((response) => {
        if (response.status != 200){
            navigate('/login');
            return null;
        }
    })

    return <Component {...props} />;
  };
}
