import { useFeatureFlags } from '@/context/FeatureFlagContext';
import React, { useEffect, useState } from 'react';

const traitsConfig: Record<string, string[] | number[] | boolean[] | null> = {
  user_group: ['internal', 'beta', 'external'],
  favorite_color: ['red', 'green', 'blue'],
  //   plan: ['Free', 'Basic', 'Pro'],
  //   role: ['Admin', 'User'],
  //   status: ['Active', 'Inactive'],
};

const UserManagement: React.FC = () => {
  const {
    flags: { isReady },
    identifyUser,
    traits: currentTraits,
  } = useFeatureFlags();
  const [selectedUser, setSelectedUser] = useState('1');
  const [userTraits, setUserTraits] = useState<Record<string, string>>(
    Object.fromEntries(Object.keys(traitsConfig).map((trait) => [trait, '']))
  );

  useEffect(() => {
    if (isReady) {
      identifyUser(selectedUser, {});
    }
  }, [selectedUser, isReady, identifyUser]);

  useEffect(() => {
    // Set initial traits from current Flagsmith traits
    setUserTraits((prevTraits) => ({
      ...prevTraits,
      ...(currentTraits as Record<string, string>),
    }));
  }, [currentTraits]);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
  };

  const handleTraitChange = (trait: string, value: string) => {
    const updatedTraits = { ...userTraits, [trait]: value };
    setUserTraits(updatedTraits);

    const filteredTraits = Object.entries(updatedTraits)
      .filter(([, value]) => value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
    updateFlagsmithIdentity(selectedUser, filteredTraits);
  };

  const updateFlagsmithIdentity = async (userId: string, traits: Record<string, string>) => {
    await identifyUser(userId, traits);
  };

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label htmlFor="user-select" className="mb-1 font-semibold">
            Select User
          </label>
          <select
            id="user-select"
            value={selectedUser}
            onChange={handleUserChange}
            className="border rounded px-2 py-1"
          >
            <option value="1">User 1</option>
            <option value="2">User 2</option>
          </select>
        </div>
        {Object.entries(traitsConfig).map(([trait, possibleValues]) => (
          <div key={trait} className="flex flex-col">
            <label htmlFor={`${trait}-select`} className="mb-1 font-semibold">
              {trait.charAt(0).toUpperCase() + trait.slice(1)}
            </label>
            <select
              id={`${trait}-select`}
              value={userTraits[trait] || ''}
              onChange={(e) => handleTraitChange(trait, e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Select {trait}</option>
              {possibleValues?.map((traitValue) => (
                <option key={`${traitValue}`} value={`${traitValue}`}>
                  {traitValue}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
