import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ArrowLeft, Calendar, ExternalLink, Users, User, CheckCircle, Clock, AlertTriangle, UserPlus } from 'lucide-react'
import { format, isAfter } from 'date-fns'
import toast from 'react-hot-toast'

const StudentAssignments = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const [course, setCourse] = useState(null)
  const [studentGroups, setStudentGroups] = useState({})
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  useEffect(() => {
    // Mock data - replace with actual API calls
    const courseData = {
      1: {
        id: 1,
        name: 'Computer Science 101',
        code: 'CS101',
        semester: 'Fall 2024',
        professor: 'Dr. John Smith'
      },
      2: {
        id: 2,
        name: 'Data Structures & Algorithms',
        code: 'CS201',
        semester: 'Fall 2024',
        professor: 'Dr. Sarah Johnson'
      },
      3: {
        id: 3,
        name: 'Database Management Systems',
        code: 'CS301',
        semester: 'Fall 2024',
        professor: 'Dr. Michael Brown'
      },
      4: {
        id: 4,
        name: 'Software Engineering',
        code: 'CS401',
        semester: 'Fall 2024',
        professor: 'Dr. Emily Davis'
      }
    }

    const mockCourse = courseData[parseInt(courseId)] || courseData[1]

    const assignmentsData = {
      1: [ // CS101 - Computer Science 101
        {
          id: 1,
          title: 'Introduction to Programming',
          description: 'Basic programming concepts and syntax. This assignment covers variables, data types, control structures, and basic algorithms.',
          deadline: new Date('2024-12-15T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs101/assignment1',
          submissionType: 'individual',
          acknowledged: true,
          acknowledgedAt: new Date('2024-11-20T10:30:00'),
          status: 'completed'
        },
        {
          id: 2,
          title: 'Basic Programming Exercises',
          description: 'Practice exercises covering loops, functions, and basic problem-solving techniques.',
          deadline: new Date('2024-12-20T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs101/assignment2',
          submissionType: 'individual',
          acknowledged: false,
          acknowledgedAt: null,
          status: 'pending'
        }
      ],
      2: [ // CS201 - Data Structures & Algorithms
        {
          id: 3,
          title: 'Linked List Implementation',
          description: 'Implement singly and doubly linked lists with all basic operations (insert, delete, search, traverse).',
          deadline: new Date('2024-12-18T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs201/assignment1',
          submissionType: 'individual',
          acknowledged: false,
          acknowledgedAt: null,
          status: 'pending'
        },
        {
          id: 4,
          title: 'Binary Tree Project',
          description: 'Design and implement a binary search tree with insertion, deletion, and traversal algorithms.',
          deadline: new Date('2024-12-25T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs201/assignment2',
          submissionType: 'group',
          acknowledged: false,
          acknowledgedAt: null,
          status: 'in-progress',
          requiresGroup: true
        }
      ],
      3: [ // CS301 - Database Management Systems
        {
          id: 5,
          title: 'Database Design Project',
          description: 'Design a normalized database schema for a library management system with ER diagrams.',
          deadline: new Date('2024-12-22T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs301/assignment1',
          submissionType: 'group',
          acknowledged: true,
          acknowledgedAt: new Date('2024-11-25T14:15:00'),
          status: 'completed',
          requiresGroup: true
        },
        {
          id: 6,
          title: 'SQL Query Optimization',
          description: 'Write and optimize complex SQL queries for performance analysis and reporting.',
          deadline: new Date('2024-12-28T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs301/assignment2',
          submissionType: 'individual',
          acknowledged: false,
          acknowledgedAt: null,
          status: 'pending'
        }
      ],
      4: [ // CS401 - Software Engineering
        {
          id: 7,
          title: 'Requirements Analysis Document',
          description: 'Create a comprehensive requirements analysis document for a web application project.',
          deadline: new Date('2024-12-20T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs401/assignment1',
          submissionType: 'group',
          acknowledged: false,
          acknowledgedAt: null,
          status: 'in-progress',
          requiresGroup: true
        },
        {
          id: 8,
          title: 'Software Testing Plan',
          description: 'Develop a complete testing strategy including unit tests, integration tests, and user acceptance tests.',
          deadline: new Date('2024-12-30T23:59:00'),
          oneDriveLink: 'https://onedrive.com/cs401/assignment2',
          submissionType: 'individual',
          acknowledged: false,
          acknowledgedAt: null,
          status: 'pending'
        }
      ]
    }

    let mockAssignments = assignmentsData[parseInt(courseId)] || assignmentsData[1]

    // Load acknowledgment data from localStorage
    mockAssignments = mockAssignments.map(assignment => {
      const acknowledgmentKey = `acknowledgment_${courseId}_${assignment.id}`
      const savedAcknowledgment = localStorage.getItem(acknowledgmentKey)
      
      if (savedAcknowledgment) {
        const acknowledgmentData = JSON.parse(savedAcknowledgment)
        return {
          ...assignment,
          acknowledged: acknowledgmentData.acknowledged,
          acknowledgedAt: new Date(acknowledgmentData.acknowledgedAt),
          status: acknowledgmentData.status
        }
      }
      
      return assignment
    })

    // Mock student groups - in real app, this would come from API
    const groupsData = {
      1: { // CS101 groups
        2: null // Not in any group for assignment 2
      },
      2: { // CS201 groups
        4: {
          id: 1,
          name: 'Data Structures Team',
          members: ['John Doe', 'Jane Smith', 'Mike Johnson'],
          leader: 'Jane Smith',
          isLeader: false
        }
      },
      3: { // CS301 groups
        5: {
          id: 2,
          name: 'Database Designers',
          members: ['Alice Brown', 'Bob Wilson', 'Carol Davis', 'You'],
          leader: 'You',
          isLeader: true // Current student is the leader
        },
        6: null
      },
      4: { // CS401 groups
        7: {
          id: 3,
          name: 'Software Engineers',
          members: ['David Lee', 'Emma Clark', 'Frank Miller'],
          leader: 'David Lee',
          isLeader: false
        },
        8: null
      }
    }

    const mockStudentGroups = groupsData[parseInt(courseId)] || {}

    setCourse(mockCourse)
    setAssignments(mockAssignments)
    setStudentGroups(mockStudentGroups)
  }, [courseId])

  const handleAcknowledgment = async (assignmentId, assignmentType) => {
    const assignment = assignments.find(a => a.id === assignmentId)
    
    if (assignmentType === 'group') {
      const group = studentGroups[assignmentId]
      if (!group) {
        toast.error('You must be part of a group to acknowledge this assignment')
        return
      }
      if (!group.isLeader) {
        toast.error('Only the group leader can acknowledge group assignments')
        return
      }
    }

    // Mock API call
    try {
      const updatedAssignments = assignments.map(a => 
        a.id === assignmentId 
          ? { 
              ...a, 
              acknowledged: true, 
              acknowledgedAt: new Date(),
              status: 'completed'
            }
          : a
      )
      
      setAssignments(updatedAssignments)
      
      // Save acknowledgment to localStorage for persistence
      const acknowledgmentKey = `acknowledgment_${courseId}_${assignmentId}`
      localStorage.setItem(acknowledgmentKey, JSON.stringify({
        acknowledged: true,
        acknowledgedAt: new Date().toISOString(),
        status: 'completed'
      }))
      
      // Update course progress in localStorage
      const courseProgressKey = `course_progress_${courseId}`
      const currentProgress = JSON.parse(localStorage.getItem(courseProgressKey) || '{}')
      const completedCount = updatedAssignments.filter(a => a.acknowledged).length
      const totalCount = updatedAssignments.length
      
      localStorage.setItem(courseProgressKey, JSON.stringify({
        ...currentProgress,
        completed: completedCount,
        pending: totalCount - completedCount,
        assignments: totalCount
      }))
      
      // Dispatch custom event to notify dashboard of progress update
      window.dispatchEvent(new CustomEvent('assignmentProgressUpdated', {
        detail: { courseId, completedCount, totalCount }
      }))
      
      toast.success(
        assignmentType === 'group' 
          ? 'Assignment acknowledged for your entire group!' 
          : 'Assignment acknowledged successfully!'
      )
    } catch (error) {
      toast.error('Failed to acknowledge assignment')
    }
  }

  const handleJoinGroup = (assignmentId) => {
    setSelectedAssignment(assignmentId)
    setShowGroupModal(true)
  }

  const getAssignmentStatus = (assignment) => {
    const isOverdue = isAfter(new Date(), assignment.deadline)
    
    if (assignment.acknowledged) {
      return {
        status: 'completed',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle,
        text: 'Completed'
      }
    } else if (isOverdue) {
      return {
        status: 'overdue',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle,
        text: 'Overdue'
      }
    } else {
      return {
        status: 'pending',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: Clock,
        text: 'Pending'
      }
    }
  }

  const AssignmentCard = ({ assignment }) => {
    const status = getAssignmentStatus(assignment)
    const StatusIcon = status.icon
    const group = studentGroups[assignment.id]
    const needsGroup = assignment.submissionType === 'group' && !group

    return (
      <div className={`card ${status.borderColor} border-2 hover:shadow-lg transition-all duration-200`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                <StatusIcon className="w-4 h-4 mr-1" />
                {status.text}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{assignment.description}</p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Due: {format(assignment.deadline, 'EEEE, MMMM dd, yyyy \'at\' HH:mm')}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                {assignment.submissionType === 'individual' ? (
                  <User className="w-4 h-4 mr-2" />
                ) : (
                  <Users className="w-4 h-4 mr-2" />
                )}
                <span className="capitalize">{assignment.submissionType} Assignment</span>
              </div>

              <div className="flex items-center text-sm">
                <ExternalLink className="w-4 h-4 mr-2 text-blue-600" />
                <a
                  href={assignment.oneDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View Assignment Details on OneDrive
                </a>
              </div>
            </div>

            {/* Group Information */}
            {assignment.submissionType === 'group' && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                {group ? (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Your Group: {group.name}</h4>
                    <div className="text-sm text-gray-600">
                      <p className="mb-1">Leader: {group.leader}</p>
                      <p>Members: {group.members.join(', ')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-700 mb-2">
                      You are not part of any group for this assignment
                    </p>
                    <button
                      onClick={() => handleJoinGroup(assignment.id)}
                      className="btn-primary text-sm flex items-center mx-auto"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Form or Join Group
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Acknowledgment Status */}
            {assignment.acknowledged ? (
              <div className="flex items-center text-sm text-green-600 mb-4">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>
                  Acknowledged on {format(assignment.acknowledgedAt, 'MMM dd, yyyy \'at\' HH:mm')}
                  {assignment.submissionType === 'group' && ' by group leader'}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {assignment.submissionType === 'individual' 
                    ? 'Click to acknowledge your submission'
                    : group && group.isLeader
                      ? 'As group leader, acknowledge for your team'
                      : group && !group.isLeader
                        ? 'Waiting for group leader to acknowledge'
                        : 'Join a group to submit this assignment'
                  }
                </div>
                
                {!needsGroup && (
                  <button
                    onClick={() => handleAcknowledgment(assignment.id, assignment.submissionType)}
                    disabled={
                      assignment.acknowledged || 
                      (assignment.submissionType === 'group' && group && !group.isLeader)
                    }
                    className={`btn-success text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      assignment.submissionType === 'group' && group && !group.isLeader 
                        ? 'btn-secondary' 
                        : 'btn-success'
                    }`}
                  >
                    {assignment.acknowledged 
                      ? 'Acknowledged' 
                      : assignment.submissionType === 'individual'
                        ? 'Acknowledge Submission'
                        : group && group.isLeader
                          ? 'Acknowledge for Group'
                          : 'Waiting for Leader'
                    }
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {course?.name} - Assignments
            </h1>
            <p className="text-gray-600">{course?.code} • {course?.semester} • Prof. {course?.professor}</p>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CheckCircle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600">
              Your professor hasn't created any assignments for this course yet.
            </p>
          </div>
        )}
      </div>

      {/* Group Management Modal */}
      {showGroupModal && (
        <GroupModal
          assignmentId={selectedAssignment}
          onClose={() => {
            setShowGroupModal(false)
            setSelectedAssignment(null)
          }}
          onGroupJoined={(assignmentId, groupData) => {
            setStudentGroups({
              ...studentGroups,
              [assignmentId]: groupData
            })
            setShowGroupModal(false)
            setSelectedAssignment(null)
            toast.success('Successfully joined group!')
          }}
        />
      )}
    </div>
  )
}

const GroupModal = ({ assignmentId, onClose, onGroupJoined }) => {
  const [availableGroups, setAvailableGroups] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  useEffect(() => {
    // Mock available groups
    const mockGroups = [
      {
        id: 1,
        name: 'Team Alpha',
        members: ['Alice Johnson', 'Bob Smith'],
        maxMembers: 4,
        leader: 'Alice Johnson'
      },
      {
        id: 2,
        name: 'Code Warriors',
        members: ['Charlie Brown', 'Diana Prince', 'Eve Wilson'],
        maxMembers: 4,
        leader: 'Charlie Brown'
      }
    ]
    setAvailableGroups(mockGroups)
  }, [])

  const handleJoinGroup = (group) => {
    const groupData = {
      id: group.id,
      name: group.name,
      members: [...group.members, 'You'],
      leader: group.leader,
      isLeader: false
    }
    onGroupJoined(assignmentId, groupData)
  }

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast.error('Please enter a group name')
      return
    }

    const groupData = {
      id: Date.now(),
      name: newGroupName,
      members: ['You'],
      leader: 'You',
      isLeader: true
    }
    onGroupJoined(assignmentId, groupData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Group Management</h2>

          {!showCreateForm ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Available Groups</h3>
                <div className="space-y-3">
                  {availableGroups.map((group) => (
                    <div key={group.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{group.name}</h4>
                        <span className="text-sm text-gray-500">
                          {group.members.length}/{group.maxMembers}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Leader: {group.leader}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        Members: {group.members.join(', ')}
                      </p>
                      <button
                        onClick={() => handleJoinGroup(group)}
                        disabled={group.members.length >= group.maxMembers}
                        className="btn-primary text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {group.members.length >= group.maxMembers ? 'Group Full' : 'Join Group'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-secondary w-full"
                >
                  Create New Group
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="input-field"
                  placeholder="Enter group name"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCreateGroup}
                  className="flex-1 btn-primary"
                >
                  Create Group
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentAssignments