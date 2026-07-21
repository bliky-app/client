import { Check, LogOut } from "lucide-react"
import { useTheme } from "@/lib/ThemeProvider"
import ModalSheetLayout from "@/layouts/ModalSheetLayout"
import Button from "@workspace/ui/components/AppButton"

import { useUserSettings } from "@/hooks/settings/useUserSettings"
import ProfileAvatarCard from "./ProfileAvatarCard"
import ProfileFormCard from "./ProfileFormCard"
import ThemePreferenceCard from "./ThemePreferenceCard"
import PasswordChangeCard from "./PasswordChangeCard"

export default function UserSettingsPage() {
  const { theme, setTheme } = useTheme()

  const {
    user,
    draftUser,
    fileInputRef,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    isFormal,
    setIsFormal,
    gender,
    setGender,
    color,
    setColor,
    timezone,
    setTimezone,
    avatarUrl,
    isSaving,
    savedSuccess,
    profileError,
    setProfileError,
    canSaveProfile,
    handleAvatarFileChange,
    handleRemoveAvatar,
    handlePickAvatar,
    showPasswordForm,
    handleTogglePasswordForm,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isChangingPassword,
    passwordError,
    setPasswordError,
    passwordSuccess,
    handlePasswordSubmit,
    handleSaveProfile,
    handleLogout,
  } = useUserSettings()

  return (
    <ModalSheetLayout title="Профиль">
      {profileError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {profileError}
        </div>
      )}

      <ProfileAvatarCard
        draftUser={draftUser}
        avatarUrl={avatarUrl}
        color={color}
        fileInputRef={fileInputRef}
        onPickAvatar={handlePickAvatar}
        onRemoveAvatar={handleRemoveAvatar}
        onAvatarFileChange={handleAvatarFileChange}
        onColorChange={setColor}
      />

      <ProfileFormCard
        firstName={firstName}
        lastName={lastName}
        phone={user?.phone || ""}
        isFormal={isFormal}
        gender={gender}
        timezone={timezone}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onGenderChange={setGender}
        onFormalChange={setIsFormal}
        onTimezoneChange={setTimezone}
        onClearError={() => setProfileError("")}
      />

      <ThemePreferenceCard
        theme={theme}
        onThemeChange={setTheme}
      />

      <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-panel-base border-t border-panel-border-subtle shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-20">
        <Button
          variant="primary"
          theme="panel"
          fullWidth
          disabled={!canSaveProfile || isSaving}
          onClick={handleSaveProfile}
        >
          {savedSuccess ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Сохранено!</span>
            </span>
          ) : isSaving ? (
            "Сохранение..."
          ) : (
            "Сохранить изменения"
          )}
        </Button>
      </div>

      <PasswordChangeCard
        isFormal={isFormal}
        showForm={showPasswordForm}
        onToggleForm={handleTogglePasswordForm}
        error={passwordError}
        success={passwordSuccess}
        currentValue={currentPassword}
        onCurrentChange={setCurrentPassword}
        newValue={newPassword}
        onNewChange={setNewPassword}
        confirmValue={confirmPassword}
        onConfirmChange={setConfirmPassword}
        isSubmitting={isChangingPassword}
        onSubmit={handlePasswordSubmit}
        onClearError={() => setPasswordError("")}
      />

      <div className="mb-6 bg-red-500/5 border border-red-500/10 rounded-[32px] p-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-red-500">Завершить сеанс</span>
          <span className="text-[11px] text-panel-text-muted">Выйти из текущего аккаунта на этом устройстве</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-medium transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Выйти</span>
        </button>
      </div>
    </ModalSheetLayout>
  )
}
