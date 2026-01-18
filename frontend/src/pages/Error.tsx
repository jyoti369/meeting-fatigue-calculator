import { useNavigate, useSearchParams } from 'react-router-dom';

function Error() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message = searchParams.get('message') || 'Something went wrong';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card max-w-md text-center">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-bold mb-2 text-red-600">Oops!</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Error;
