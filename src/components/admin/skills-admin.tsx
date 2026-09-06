"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { deleteSkillAction, upsertSkillAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import type { Skill, SkillCategory } from "@/types";

const fieldClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]";

export function SkillsAdmin({
  categories,
  skills,
}: {
  categories: SkillCategory[];
  skills: Skill[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [proficiency, setProficiency] = useState(80);

  const grouped = useMemo(() => {
    return categories.map((cat) => ({
      category: cat,
      items: skills
        .filter((s) => s.category_id === cat.id)
        .sort((a, b) => a.sort_order - b.sort_order),
    }));
  }, [categories, skills]);

  const addSkill = () => {
    if (!name.trim() || !categoryId) return;
    const sortOrder =
      skills.filter((s) => s.category_id === categoryId).length + 1;
    const skill: Skill = {
      id: `sk-${crypto.randomUUID()}`,
      category_id: categoryId,
      name: name.trim(),
      proficiency: Number(proficiency) || null,
      sort_order: sortOrder,
    };
    startTransition(async () => {
      await upsertSkillAction(skill);
      setName("");
      router.refresh();
    });
  };

  const updateProficiency = (skill: Skill, value: number) => {
    startTransition(async () => {
      await upsertSkillAction({ ...skill, proficiency: value });
      router.refresh();
    });
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this skill?")) return;
    startTransition(async () => {
      await deleteSkillAction(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-[1fr_180px_120px_auto]">
        <input
          className={fieldClass}
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className={fieldClass}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          max={100}
          className={fieldClass}
          value={proficiency}
          onChange={(e) => setProficiency(Number(e.target.value))}
          aria-label="Proficiency"
        />
        <Button type="button" onClick={addSkill} disabled={pending || !name.trim()}>
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Add
        </Button>
      </div>

      <div className="space-y-6">
        {grouped.map(({ category, items }) => (
          <section key={category.id} className="space-y-3">
            <h2 className="font-semibold text-xl tracking-tight">
              {category.name}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              {items.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[var(--muted)]">
                  No skills in this category.
                </p>
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {items.map((skill) => (
                    <li
                      key={skill.id}
                      className="flex flex-wrap items-center gap-3 px-4 py-3"
                    >
                      <p className="min-w-[160px] flex-1 font-medium">
                        {skill.name}
                      </p>
                      <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                        Proficiency
                        <input
                          type="number"
                          min={0}
                          max={100}
                          className="w-20 rounded-xl border border-[var(--border)] bg-transparent px-2 py-1.5 text-sm text-[var(--foreground)]"
                          value={skill.proficiency ?? 0}
                          onChange={(e) =>
                            updateProficiency(skill, Number(e.target.value))
                          }
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => remove(skill.id)}
                        className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--muted)] hover:text-[var(--danger)]"
                        aria-label="Delete skill"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
