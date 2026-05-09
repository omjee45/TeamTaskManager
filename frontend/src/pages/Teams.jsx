import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Teams = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [workloadTeams, setWorkloadTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teams');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [teamLead, setTeamLead] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [expandedTeams, setExpandedTeams] = useState([]);
  const [addMemberUserId, setAddMemberUserId] = useState('');

  useEffect(() => {
    fetchTeams();
    fetchUsers();
    fetchWorkload();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (error) {
      console.error('Error fetching teams', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setAllUsers(res.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchWorkload = async () => {
    try {
      const res = await api.get('/teams/workload');
      setWorkloadTeams(res.data);
    } catch (error) {
      console.error('Error fetching workload', error);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teams', {
        name: teamName,
        description: teamDesc,
        lead: teamLead || undefined,
        members: selectedMembers,
      });
      setTeamName('');
      setTeamDesc('');
      setTeamLead('');
      setSelectedMembers([]);
      setShowCreateForm(false);
      fetchTeams();
      fetchWorkload();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating team');
    }
  };

  const handleAddMember = async (teamId) => {
    if (!addMemberUserId) return;
    try {
      await api.post(`/teams/${teamId}/members`, { userId: addMemberUserId });
      setAddMemberUserId('');
      fetchTeams();
      fetchWorkload();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding member');
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    try {
      await api.put(`/teams/${teamId}/members/remove`, { userId });
      fetchTeams();
      fetchWorkload();
    } catch (error) {
      alert(error.response?.data?.message || 'Error removing member');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await api.delete(`/teams/${teamId}`);
      fetchTeams();
      fetchWorkload();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting team');
    }
  };

  const toggleMember = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const getWorkloadColor = (count) => {
    if (count === 0) return 'bg-outline-variant/30 text-on-surface-variant';
    if (count <= 2) return 'bg-primary/10 text-primary';
    if (count <= 4) return 'bg-amber-500/10 text-amber-600';
    return 'bg-error/10 text-error';
  };

  const getWorkloadLabel = (count) => {
    if (count === 0) return 'Free';
    if (count <= 2) return 'Light';
    if (count <= 4) return 'Moderate';
    return 'Heavy';
  };

  if (loading) return <div className="p-8 text-on-surface-variant text-center">Loading teams...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

      <div className="flex items-center gap-2 border-b border-outline-variant pb-4">
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all ${
            activeTab === 'teams'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Teams
          </span>
        </button>
        <button
          onClick={() => setActiveTab('workload')}
          className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all ${
            activeTab === 'workload'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Workload
          </span>
        </button>
      </div>

      {activeTab === 'teams' && (
        <>
          
          {user?.role === 'admin' && (
            <div>
              {!showCreateForm ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Team
                </button>
              ) : (
                <form onSubmit={handleCreateTeam} className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">New Team</h3>
                    <button type="button" onClick={() => setShowCreateForm(false)} className="text-on-surface-variant hover:text-error transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Team Name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      className="bg-background rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={teamDesc}
                      onChange={(e) => setTeamDesc(e.target.value)}
                      className="bg-background rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <select
                    value={teamLead}
                    onChange={(e) => setTeamLead(e.target.value)}
                    className="bg-background rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">Select Team Lead...</option>
                    {allUsers.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>

                  <div>
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Select Members</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {allUsers.map(u => (
                        <button
                          key={u._id}
                          type="button"
                          onClick={() => toggleMember(u._id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            selectedMembers.includes(u._id)
                              ? 'bg-primary text-on-primary border-primary shadow-sm'
                              : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-primary'
                          }`}
                        >
                          {u.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="bg-primary text-on-primary rounded-lg px-4 py-2 text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm self-end">
                    Create Team
                  </button>
                </form>
              )}
            </div>
          )}

          {teams.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium">No teams yet</p>
              <p className="text-xs mt-1">Create your first team to organize your workforce</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {teams.map(team => (
                <div key={team._id} className="bg-surface-container-lowest rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col gap-4">
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-on-surface">{team.name}</h3>
                        {team.description && <p className="text-xs text-on-surface-variant mt-0.5">{team.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                      </span>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDeleteTeam(team._id)} className="p-1 rounded hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors" title="Delete Team">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {team.lead && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-lg /50">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-xs font-bold text-on-surface">Lead:</span>
                      <span className="text-xs text-on-surface-variant">{team.lead.name}</span>
                      <span className="text-[10px] text-outline">({team.lead.email})</span>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setExpandedTeams(prev => prev.includes(team._id) ? prev.filter(id => id !== team._id) : [...prev, team._id])}
                      className="flex items-center gap-1 text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 hover:text-primary transition-colors"
                    >
                      <svg className={`w-3 h-3 transition-transform ${expandedTeams.includes(team._id) ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      Members
                    </button>

                    {expandedTeams.includes(team._id) && (
                      <div className="flex flex-col gap-2 mt-2">
                        {team.members.map(member => (
                          <div key={member._id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low /50">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center text-[10px] font-bold">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-on-surface">{member.name}</span>
                                <span className="text-[10px] text-on-surface-variant">{member.email}</span>
                              </div>
                            </div>
                            {user?.role === 'admin' && (
                              <button
                                onClick={() => handleRemoveMember(team._id, member._id)}
                                className="text-on-surface-variant hover:text-error text-[10px] font-bold uppercase tracking-wider transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}

                        {team.members.length === 0 && (
                          <p className="text-xs text-on-surface-variant opacity-60 text-center py-2">No members yet</p>
                        )}

                        {user?.role === 'admin' && (
                          <div className="flex items-center gap-2 mt-2">
                            <select
                              value={addMemberUserId}
                              onChange={(e) => setAddMemberUserId(e.target.value)}
                              className="flex-1 bg-background rounded-lg px-3 py-1.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            >
                              <option value="">Add a member...</option>
                              {allUsers
                                .filter(u => !team.members.map(m => m._id).includes(u._id))
                                .map(u => (
                                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                ))
                              }
                            </select>
                            <button
                              onClick={() => handleAddMember(team._id)}
                              className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'workload' && (
        <div className="flex flex-col gap-6">
          {workloadTeams.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm font-medium">No workload data</p>
              <p className="text-xs mt-1">Create teams and assign tasks to see workload distribution</p>
            </div>
          ) : (
            workloadTeams.map(team => (
              <div key={team._id} className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-outline-variant">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-base font-bold text-on-surface">{team.name}</h3>
                  <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {team.lead && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Team Lead</span>
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface-container-low /50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center text-xs font-bold">
                          {team.lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-on-surface">{team.lead.name}</span>
                          <p className="text-[10px] text-on-surface-variant">{team.lead.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getWorkloadColor(team.lead.workload?.activeTasks || 0)}`}>
                          {getWorkloadLabel(team.lead.workload?.activeTasks || 0)}
                        </span>
                        <span className="text-xs font-bold text-on-surface">{team.lead.workload?.activeTasks || 0} tasks</span>
                      </div>
                    </div>
                  </div>
                )}

                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Members</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {team.members.map(member => (
                    <div key={member._id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface-container-low /50 hover:bg-surface-container-high transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center text-[10px] font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-on-surface">{member.name}</span>
                          <p className="text-[10px] text-on-surface-variant">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        
                        <div className="w-12 h-1 bg-outline-variant/30 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full transition-all ${
                              member.workload?.activeTasks >= 5
                                ? 'bg-error'
                                : member.workload?.activeTasks >= 3
                                ? 'bg-amber-500'
                                : 'bg-primary'
                            }`}
                            style={{ width: `${Math.min((member.workload?.activeTasks || 0) * 20, 100)}%` }}
                          />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getWorkloadColor(member.workload?.activeTasks || 0)}`}>
                          {member.workload?.activeTasks || 0} tasks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </main>
  );
};

export default Teams;
