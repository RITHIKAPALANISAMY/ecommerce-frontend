import { useState } from "react";

export default function AddressForm({ onSubmit }) {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const handleSubmit = () => {
    if (
      !address.name ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please fill all fields");
      return;
    }
    onSubmit(address);
  };

  return (
    <div className="checkout-card">
      <h3>Select Delivery Address</h3>

      <input
        placeholder="Name"
        value={address.name}
        onChange={(e) =>
          setAddress({ ...address, name: e.target.value })
        }
      />

      <input
        placeholder="Phone"
        value={address.phone}
        onChange={(e) =>
          setAddress({ ...address, phone: e.target.value })
        }
      />

      <input
        placeholder="Street"
        value={address.street}
        onChange={(e) =>
          setAddress({ ...address, street: e.target.value })
        }
      />

      <input
        placeholder="City"
        value={address.city}
        onChange={(e) =>
          setAddress({ ...address, city: e.target.value })
        }
      />

      <input
        placeholder="Pincode"
        value={address.pincode}
        onChange={(e) =>
          setAddress({ ...address, pincode: e.target.value })
        }
      />

      <button className="btn" onClick={handleSubmit}>
        Continue
      </button>
    </div>
  );
}
