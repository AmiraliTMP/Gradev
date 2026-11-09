import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import ClassCard, { getClassUnits } from "../../components/classes/ClassCard";
import StatCard from "../../components/classes/StatCard";
import Form from "../../components/forms/Form";
import Modal from "../../components/Modal";

import classesServices from "../../services/classes/classes";

const BOOKS = {
  "Family & Friends": ["1", "2", "3", "4"],
  InterChange: ["Intro", "1", "2", "3"],
};

const SEMESTERS = ["A", "B", "C"];

const INITIAL_FORM_DATA = {
  groupName: "",
  book: "Family & Friends",
  level: "1",
  semester: "A",
};

function getClassesFromResponse(response) {
  // Supports raw arrays and common Axios/API response shapes.
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.classes)) return payload.classes;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.classes)) return payload.data.classes;

  return [];
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function Classes() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [bookFilter, setBookFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedClass, setSelectedClass] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formError, setFormError] = useState("");

  // ----------------------------------
  // Fetch Classes
  // ----------------------------------

  const {
    data: classes = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["classes", search, bookFilter],

    queryFn: async () => {
      const params = {
        limit: 100,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (bookFilter !== "all") {
        params.book = bookFilter;
      }

      const response = await classesServices.getClasses(params);

      return getClassesFromResponse(response);
    },
  });

  // ----------------------------------
  // Create Class
  // ----------------------------------

  const createMutation = useMutation({
    mutationFn: (data) => classesServices.createClass(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });

      closeModal();
    },

    onError: (error) => {
      setFormError(getErrorMessage(error));
    },
  });

  // ----------------------------------
  // Update Class
  // ----------------------------------

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => classesServices.updateClass(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });

      closeModal();
    },

    onError: (error) => {
      setFormError(getErrorMessage(error));
    },
  });

  // ----------------------------------
  // Delete Class
  // ----------------------------------

  const deleteMutation = useMutation({
    mutationFn: (id) => classesServices.deleteClass(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });

      closeModal();
    },

    onError: (error) => {
      setFormError(getErrorMessage(error));
    },
  });

  // ----------------------------------
  // Modal Functions
  // ----------------------------------

  function openCreateModal() {
    setModalMode("create");
    setSelectedClass(null);
    setFormData(INITIAL_FORM_DATA);
    setFormError("");
    setIsModalOpen(true);
  }

  function openEditModal(classItem) {
    setModalMode("edit");
    setSelectedClass(classItem);

    setFormData({
      // Prefer the editable groupName field over a potentially derived display name.
      groupName: classItem.groupName || classItem.name || "",
      book: classItem.book || "Family & Friends",
      level: String(classItem.level || "1"),
      semester: classItem.semester || "A",
    });

    setFormError("");
    setIsModalOpen(true);
  }

  function openDeleteModal(classItem) {
    setModalMode("delete");
    setSelectedClass(classItem);
    setFormError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedClass(null);
    setFormData(INITIAL_FORM_DATA);
    setFormError("");
  }

  // ----------------------------------
  // Form Functions
  // ----------------------------------

  function handleFormChange(name, value) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,

      ...(name === "book"
        ? {
            level: BOOKS[value]?.[0] || "1",
          }
        : {}),
    }));

    setFormError("");
  }

  function validateForm() {
    const groupName = formData.groupName.trim();

    if (!groupName) {
      setFormError("Group name is required.");
      return false;
    }

    if (groupName.length < 2) {
      setFormError("Group name must contain at least 2 characters.");
      return false;
    }

    if (groupName.length > 50) {
      setFormError("Group name cannot exceed 50 characters.");
      return false;
    }

    if (!BOOKS[formData.book]?.includes(formData.level)) {
      setFormError("Please select a valid level.");
      return false;
    }

    if (!SEMESTERS.includes(formData.semester)) {
      setFormError("Please select a valid semester.");
      return false;
    }

    return true;
  }

  function handleSubmit() {
    setFormError("");

    if (!validateForm()) return;

    const payload = {
      groupName: formData.groupName.trim(),
      book: formData.book,
      level: formData.level,
      semester: formData.semester,
    };

    if (modalMode === "create") {
      createMutation.mutate(payload);
    }

    if (modalMode === "edit" && selectedClass) {
      updateMutation.mutate({
        id: selectedClass._id,
        data: payload,
      });
    }
  }

  function handleDelete() {
    if (!selectedClass?._id) return;

    deleteMutation.mutate(selectedClass._id);
  }

  // ----------------------------------
  // Form Fields
  // ----------------------------------

  const availableLevels = BOOKS[formData.book] || [];

  const classFormFields = [
    {
      name: "groupName",
      label: "Group Name",
      type: "text",
      placeholder: "e.g. Saturday Morning",
      required: true,
      maxLength: 50,
      description: "Choose a recognizable name for your class.",
      colSpan: "sm:col-span-2",
    },
    {
      name: "book",
      label: "Book",
      type: "select",
      required: true,
      options: Object.keys(BOOKS).map((book) => ({
        label: book,
        value: book,
      })),
    },
    {
      name: "level",
      label: "Level",
      type: "select",
      required: true,
      options: availableLevels.map((level) => ({
        label: level === "Intro" ? "Intro" : `Level ${level}`,
        value: level,
      })),
    },
    {
      name: "semester",
      label: "Semester",
      type: "select",
      required: true,
      options: SEMESTERS.map((semester) => ({
        label: `Semester ${semester}`,
        value: semester,
      })),
    },
  ];

  // ----------------------------------
  // Statistics
  // ----------------------------------

  const statistics = useMemo(() => {
    const totalClasses = classes.length;

    const totalUnits = classes.reduce((total, classItem) => {
      return total + getClassUnits(classItem).length;
    }, 0);

    const familyAndFriendsCount = classes.filter(
      (classItem) => classItem.book === "Family & Friends",
    ).length;

    const interChangeCount = classes.filter(
      (classItem) => classItem.book === "InterChange",
    ).length;

    return {
      totalClasses,
      totalUnits,
      familyAndFriendsCount,
      interChangeCount,
    };
  }, [classes]);

  // ----------------------------------
  // Mutation Loading State
  // ----------------------------------

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const isDeleting = deleteMutation.isPending;

  // ----------------------------------
  // Render
  // ----------------------------------

  return (
    <div className="min-h-screen space-y-8 bg-[#0B0D10] p-4 text-white sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <GraduationCap size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Classes</h1>

              <p className="mt-1 text-sm text-gray-400">
                Manage your classes, books, and semesters.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-[#0B0D10] transition hover:bg-emerald-400"
        >
          <Plus size={18} />
          Add New Class
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Classes"
          value={statistics.totalClasses}
          icon={Users}
          color="emerald"
        />

        <StatCard
          title="Total Units"
          value={statistics.totalUnits}
          icon={Layers}
          color="blue"
        />

        <StatCard
          title="Family & Friends"
          value={statistics.familyAndFriendsCount}
          icon={BookOpen}
          color="purple"
        />

        <StatCard
          title="InterChange"
          value={statistics.interChangeCount}
          icon={BookOpen}
          color="orange"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#101216] p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search classes..."
            className="w-full rounded-xl border border-white/5 bg-[#0B0D10] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-500/50"
          />
        </div>

        <select
          value={bookFilter}
          onChange={(event) => setBookFilter(event.target.value)}
          className="rounded-xl border border-white/5 bg-[#0B0D10] px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50"
        >
          <option value="all">All Books</option>

          {Object.keys(BOOKS).map((book) => (
            <option key={book} value={book}>
              {book}
            </option>
          ))}
        </select>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#0B0D10] px-4 py-3 text-sm text-gray-300 transition hover:border-emerald-500/30 hover:text-emerald-400 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Classes Content */}
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw size={28} className="animate-spin text-emerald-400" />

            <p className="text-sm text-gray-400">Loading classes...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-500/10 bg-[#101216] p-8 text-center">
          <p className="font-medium text-red-400">{getErrorMessage(error)}</p>

          <button
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
          >
            Try Again
          </button>
        </div>
      ) : classes.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#101216] p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <GraduationCap size={30} />
          </div>

          <h3 className="text-lg font-semibold">
            {search || bookFilter !== "all"
              ? "No classes found"
              : "No classes yet"}
          </h3>

          <p className="mt-2 max-w-sm text-sm text-gray-400">
            {search || bookFilter !== "all"
              ? "Try changing your search or filter."
              : "Create your first class to get started."}
          </p>

          {!search && bookFilter === "all" && (
            <button
              onClick={openCreateModal}
              className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#0B0D10] transition hover:bg-emerald-400"
            >
              <Plus size={16} />
              Create Class
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem._id}
              classItem={classItem}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen && modalMode !== "delete"}
        onClose={closeModal}
        title={modalMode === "edit" ? "Edit Class" : "Create New Class"}
        description={
          modalMode === "edit"
            ? "Update the information of your class."
            : "Fill in the information to create a new class."
        }
        onSubmit={handleSubmit}
        submitText={modalMode === "edit" ? "Save Changes" : "Create Class"}
        cancelText="Cancel"
        isSubmitting={isSubmitting}
        size="lg"
      >
        <Form
          fields={classFormFields}
          values={formData}
          onChange={handleFormChange}
          error={formError}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isModalOpen && modalMode === "delete"}
        onClose={closeModal}
        title="Delete Class"
        description={`Are you sure you want to delete "${
          selectedClass?.name || selectedClass?.groupName || ""
        }"? This action cannot be undone.`}
        onSubmit={handleDelete}
        submitText="Delete Class"
        cancelText="Cancel"
        isSubmitting={isDeleting}
        size="md"
        variant="danger"
      >
        {formError && (
          <p className="rounded-xl border border-red-500/10 bg-red-500/5 p-3 text-sm text-red-400">
            {formError}
          </p>
        )}
      </Modal>
    </div>
  );
}

export default Classes;
