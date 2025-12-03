import { useRouter } from "./useRouter";
import { routes, defaultRoute } from "./routes";
import { useEffect } from "react";

export default function Router() {
  const { currentPath, navigate } = useRouter();

  // Extract route params (/movie/:id -> { id: "123" })
  const extractParams = (routePath, actualPath) => {
    const routeParts = routePath.split("/");
    const actualParts = actualPath.split("/");
    const params = {};

    if (routeParts.length !== actualParts.length) {
      return null;
    }

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        // This is a parameter
        const paramName = routeParts[i].slice(1);
        params[paramName] = actualParts[i];
      } else if (routeParts[i] !== actualParts[i]) {
        return null;
      }
    }

    return params;
  };

  // Find matching route
  const findRoute = () => {
    // Try exact matches first
    for (const route of routes) {
      if (route.exact && route.path === currentPath) {
        return { route, params: {} };
      }
    }

    // Try parameterized routes
    for (const route of routes) {
      const params = extractParams(route.path, currentPath);
      if (params !== null) {
        return { route, params };
      }
    }

    // Try non-exact matches
    for (const route of routes) {
      if (!route.exact && currentPath.startsWith(route.path)) {
        return { route, params: {} };
      }
    }

    return null;
  };

  const match = findRoute();

  // Handle 404 redirect to default route
  useEffect(() => {
    if (!match && currentPath !== defaultRoute) {
      navigate(defaultRoute);
    }
  }, [match, currentPath, navigate]);

  if (!match) {
    // Try to find default route to render while redirecting
    const defaultMatch = routes.find(r => r.path === defaultRoute);
    if (defaultMatch) {
      const Component = defaultMatch.component;
      return <Component {...(defaultMatch.props || {})} />;
    }
    return <div>404 - Page not found</div>;
  }

  const { route, params } = match;
  const Component = route.component;

  // Map URL params to component props
  const componentProps = { ...(route.props || {}) };
  
  // Handle param mapping (URL param 'id' -> component prop 'movie_id')
  if (route.paramMap && params) {
    Object.keys(route.paramMap).forEach(urlParam => {
      const componentProp = route.paramMap[urlParam];
      if (params[urlParam] !== undefined) {
        componentProps[componentProp] = params[urlParam];
      }
    });
  } else if (params) {
    Object.assign(componentProps, params);
  }

  return <Component {...componentProps} />;
}

