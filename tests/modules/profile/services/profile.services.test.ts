import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/api.client";
import { RESUME_UPLOAD_TIMEOUT_MS } from "@/modules/profile/constants";
import { profileService } from "@/modules/profile/services/profile.services";
import { axiosErrorWith, errorBody } from "@tests/helpers/axios";
import { profile } from "@tests/helpers/profile";

// apiClient already unwraps `res.data`, so the mocks resolve with the payload itself.
vi.mock("@/lib/api/api.client", () => ({ apiClient: { get: vi.fn(), post: vi.fn(), delete: vi.fn() } }));

const get = vi.mocked(apiClient.get);
const post = vi.mocked(apiClient.post);
const remove = vi.mocked(apiClient.delete);

beforeEach(() => vi.clearAllMocks());

describe("profileService", () => {
  describe("get", () => {
    it("reads the signed-in user's profile from /profile, with no id in the URL (EC24)", async () => {
      get.mockResolvedValueOnce(profile());

      await expect(profileService.get()).resolves.toEqual(profile());
      expect(get).toHaveBeenCalledWith("/profile");
    });

    it("returns null for PROFILE_NOT_FOUND: no résumé yet is a state, not an error (AC2, EC1)", async () => {
      get.mockRejectedValueOnce(axiosErrorWith(404, errorBody("PROFILE_NOT_FOUND", "You haven't uploaded a résumé yet.")));

      await expect(profileService.get()).resolves.toBeNull();
    });

    it("lets any other failure through (EC2)", async () => {
      const failure = axiosErrorWith(500, errorBody("INTERNAL_ERROR", "Something went wrong"));
      get.mockRejectedValueOnce(failure);

      await expect(profileService.get()).rejects.toBe(failure);
    });

    it("rejects a reply that isn't a profile (AC15)", async () => {
      get.mockResolvedValueOnce({ skills: "Python" });

      await expect(profileService.get()).rejects.toThrow();
    });
  });

  describe("upload", () => {
    it("posts one multipart `file` part with the upload's own time budget and returns the profile (AC3, AC14)", async () => {
      post.mockResolvedValueOnce(profile());
      const file = new File(["%PDF-1.7"], "resume.pdf", { type: "application/pdf" });

      await expect(profileService.upload(file)).resolves.toEqual(profile());

      const [url, body, config] = post.mock.calls[0];
      expect(url).toBe("/profile/resume");
      expect(body).toBeInstanceOf(FormData);
      expect([...(body as FormData).keys()]).toEqual(["file"]);
      expect((body as FormData).get("file")).toBe(file);
      expect(config).toEqual({ timeout: RESUME_UPLOAD_TIMEOUT_MS });
    });

    it("lets a refusal through for the page to show (EC5)", async () => {
      const refusal = axiosErrorWith(413, errorBody("RESUME_TOO_LARGE", "That file is too large."));
      post.mockRejectedValueOnce(refusal);

      await expect(profileService.upload(new File(["x"], "resume.pdf"))).rejects.toBe(refusal);
    });
  });

  describe("remove", () => {
    it("deletes /profile (AC7, EC14: cuewise-be answers 204 even when there is none)", async () => {
      remove.mockResolvedValueOnce("");

      await expect(profileService.remove()).resolves.toBeUndefined();
      expect(remove).toHaveBeenCalledWith("/profile");
    });
  });
});
