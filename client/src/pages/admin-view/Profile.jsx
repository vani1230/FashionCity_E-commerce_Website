const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">

      <h2 className="text-2xl font-semibold text-purple-700 mb-6">
        Admin Profile
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <p className="text-gray-500">Admin Name</p>
          <p className="font-medium">Vani Gupta</p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">admin@email.com</p>
        </div>

        <div>
          <p className="text-gray-500">Store Name</p>
          <p className="font-medium">Vani Fashion Store</p>
        </div>

        <div>
          <p className="text-gray-500">Store Type</p>
          <p className="font-medium">Online + Offline</p>
        </div>

        <div>
          <p className="text-gray-500">Offline Store Address</p>
          <p className="font-medium">
            Meerut, Uttar Pradesh, India
          </p>
        </div>

        <div>
          <p className="text-gray-500">Contact</p>
          <p className="font-medium">+91 XXXXX XXXXX</p>
        </div>

      </div>

    </div>
  );
};

export default Profile;