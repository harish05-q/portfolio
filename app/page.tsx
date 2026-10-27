import Journey from "@/components/journey/Journey";
import {
  achievements,
  bio,
  education,
  experience,
  profile,
  projects,
  skills,
} from "@/lib/data";

/**
 * The interactive journey is the page. Below it sits a visually-hidden text
 * copy of the same content, so search engines and screen-reader users get the
 * whole portfolio without having to drive the animation.
 */
export default function Home() {
  return (
    <>
      <Journey />

      <section className="sr-only-text" aria-label="Text version of this portfolio">
        <h2>
          {profile.name}: {profile.role}
        </h2>
        <p>{profile.tagline}</p>
        <p>{bio}</p>

        <h2>Projects</h2>
        {projects.map((p) => (
          <article key={p.slug}>
            <h3>{p.name}</h3>
            <p>{p.tagline}</p>
            <p>{p.problem}</p>
            <ul>
              {p.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <p>Stack: {p.stack.join(", ")}</p>
          </article>
        ))}

        <h2>Skills</h2>
        {skills.map((s) => (
          <p key={s.group}>
            {s.group}: {s.items.join(", ")}
          </p>
        ))}

        <h2>Experience</h2>
        {experience.map((x) => (
          <article key={x.org}>
            <h3>
              {x.role}, {x.org} ({x.period})
            </h3>
            <ul>
              {x.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </article>
        ))}

        <h2>Education</h2>
        <p>
          {education.degree}, {education.school}, {education.period}, {education.detail}
        </p>

        <h2>Achievements</h2>
        <ul>
          {achievements.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>

        <h2>Contact</h2>
        <p>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </section>
    </>
  );
}
