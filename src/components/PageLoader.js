import "./PageLoader.css";

/*
  Shared loading state.

  Used by every page while it waits for the admin panel content to arrive
  from the API. Showing this (instead of the page's hardcoded default
  images) is what stops the "old image shows first, then swaps to the
  admin image" flash on every page.
*/
function PageLoader({ message = "Loading..." }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="page-loader-spinner" />
      <p>{message}</p>
    </div>
  );
}

export default PageLoader;
