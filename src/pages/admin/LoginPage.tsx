// Login Component
export const LoginAdminPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md p-6 mx-auto mt-8">
        <div className="p-4 rounded-t-lg bg-primary">
          <h1 className="text-2xl font-semibold text-center text-white">
            Login
          </h1>
        </div>

        <div className="p-6 rounded-b-lg bg-yellow-50">
          <form className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-800">Email</label>
              <input
                type="email"
                placeholder="Masukkan Email..."
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-800">Password</label>
              <input
                type="password"
                placeholder="Masukkan Password..."
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-medium text-white rounded-lg bg-primary hover:bg-primary"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
