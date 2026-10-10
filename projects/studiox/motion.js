/* One seekable, paused timeline. Canonical copy and scene cues come from storyboard.json,
 * embedded verbatim in index.html so capture has no asynchronous data dependency. */
window.buildStudioXTimeline = () => {
  const config = JSON.parse(document.getElementById("studiox-storyboard").textContent);
  const scenes = Object.fromEntries(config.scenes.map((scene) => [scene.id, scene]));
  const cue = (id, name) => scenes[id].start + scenes[id].cues[name];
  document.querySelectorAll("[data-copy]").forEach((node) => {
    const [scene, line] = node.dataset.copy.split(":");
    node.textContent = scenes[scene].copy[Number(line)];
  });
  const root = document.getElementById("root");
  root.style.setProperty("--ink", config.palette.ink);
  root.style.setProperty("--paper", config.palette.paper);
  root.style.setProperty("--signal", config.palette.signal);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
  config.scenes.forEach((scene) => tl.addLabel(scene.id, scene.start));
  const enter = (target, from, to, at) =>
    tl.fromTo(target, from, { ...to, immediateRender: false }, at);

  // A small thought, then the cursor becomes a horizontal promise.
  enter("#idea-bar", { scaleY: 0 }, { scaleY: 1, duration: 0.32 }, cue("idea", "bar"));
  enter(
    "#idea-title",
    { y: 38, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.55 },
    cue("idea", "title"),
  );
  tl.to(
    "#idea-bar",
    { rotation: 90, scaleY: 5.5, x: -296, y: 120, duration: 0.64, ease: "power3.inOut" },
    cue("idea", "underline"),
  );

  // Stretching one word makes the waiting feel physical.
  enter(
    "#wait-title",
    { y: 140, opacity: 1 },
    { y: 0, opacity: 1, duration: 0.5 },
    cue("wait", "title"),
  );
  enter(
    "#wait-word",
    { y: 80, opacity: 0, scaleX: 1 },
    { y: 0, opacity: 1, scaleX: 1, duration: 0.4 },
    cue("wait", "word"),
  );
  enter("#wait-bar", { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, cue("wait", "word"));
  tl.to("#wait-word", { scaleX: 1.28, duration: 2.1, ease: "power1.in" }, cue("wait", "stretch"));
  tl.to("#wait-bar", { scaleX: 1.28, duration: 2.1, ease: "power1.in" }, cue("wait", "stretch"));

  // A two-frame signal hit and one decisive diagonal cut.
  enter(
    "#cut-flash",
    { opacity: 1 },
    { opacity: 0, duration: 0.1, ease: "none" },
    cue("cut", "flash"),
  );
  enter(
    "#cut-slash",
    { x: -2320, rotation: -14, opacity: 1 },
    { x: 2300, rotation: -14, opacity: 1, duration: 0.28, ease: "power2.inOut" },
    cue("cut", "slash"),
  );
  enter(
    "#cut-title",
    { scale: 0.88, y: 22, opacity: 0 },
    { scale: 1, y: 0, opacity: 1, duration: 0.34, ease: "expo.out" },
    cue("cut", "title"),
  );
  enter(
    "#cut-rule",
    { scaleX: 0, opacity: 1 },
    { scaleX: 1, opacity: 1, duration: 0.42 },
    cue("cut", "title") + 0.22,
  );

  // The ghost trail rides the same window as the fast arrival and resolves sharp.
  enter(
    "#move-title",
    { y: 195, opacity: 1 },
    { y: 0, opacity: 1, duration: 0.46 },
    cue("move", "title"),
  );
  [1, 2, 3].forEach((i) => {
    enter(
      `#move-echo-${i}`,
      { x: -560 - i * 95, opacity: 0.24 / i },
      { x: 0, opacity: 0, duration: 0.55, ease: "expo.out" },
      cue("move", "echo"),
    );
  });
  enter(
    "#move-word",
    { x: -560, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.55, ease: "expo.out" },
    cue("move", "word"),
  );
  enter(
    "#move-path",
    { scaleX: 0, opacity: 1 },
    { scaleX: 1, opacity: 1, duration: 0.6, ease: "power3.inOut" },
    cue("move", "line"),
  );
  enter(
    "#move-tip",
    { x: -1100, opacity: 1, scaleY: 0.25 },
    { x: 0, opacity: 1, scaleY: 1, duration: 0.6, ease: "power3.inOut" },
    cue("move", "line"),
  );

  // Three virtues, three different attacks: slices, weight, then velocity.
  enter(
    "#sharp-base",
    { scaleX: 0.9, opacity: 0 },
    { scaleX: 1, opacity: 1, duration: 0.23, ease: "expo.out" },
    cue("sharper", "title"),
  );
  enter(
    "#sharp-top",
    { x: -90, opacity: 1 },
    { x: 0, opacity: 0, duration: 0.36, ease: "expo.out" },
    cue("sharper", "slices"),
  );
  enter(
    "#sharp-bottom",
    { x: 90, opacity: 1 },
    { x: 0, opacity: 0, duration: 0.36, ease: "expo.out" },
    cue("sharper", "slices"),
  );
  enter(
    "#sharp-rule",
    { scaleX: 0, opacity: 1 },
    { scaleX: 1, opacity: 1, duration: 0.3 },
    cue("sharper", "line"),
  );
  enter(
    "#bold-title",
    { scale: 0.63, opacity: 1 },
    { scale: 1, opacity: 1, duration: 0.38, ease: "back.out(1.35)" },
    cue("bolder", "title"),
  );
  enter(
    "#bold-rule",
    { scaleX: 0, opacity: 1 },
    { scaleX: 1, opacity: 1, duration: 0.22, ease: "expo.out" },
    cue("bolder", "line"),
  );
  enter(
    "#fast-title",
    { x: -1350, skewX: -12, opacity: 1 },
    { x: 0, skewX: 0, opacity: 1, duration: 0.39, ease: "expo.out" },
    cue("faster", "title"),
  );
  document.querySelectorAll("#faster-streaks i").forEach((node, i) => {
    const at = cue("faster", "streaks") + (i % 3) * 0.045;
    enter(
      node,
      { x: -1150, scaleX: 1.4, opacity: 1 },
      { x: 260, scaleX: 0.2, opacity: 0, duration: 0.5, ease: "power3.out" },
      at,
    );
  });

  // A dispersed field becomes a composed object: idea to impact, not decoration.
  enter(
    "#impact-first",
    { y: 160, opacity: 1 },
    { y: 0, opacity: 1, duration: 0.55 },
    cue("impact", "title"),
  );
  enter(
    "#impact-second",
    { y: 160, opacity: 1 },
    { y: 0, opacity: 1, duration: 0.55 },
    cue("impact", "second"),
  );
  enter(
    "#impact-outline",
    { scale: 0.6, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.65 },
    cue("impact", "second"),
  );
  const pieces = [
    { x: -355, y: -25, rotation: -16, scale: 0.6 },
    { x: -70, y: -110, rotation: 8, scale: 0.5 },
    { x: 370, y: -20, rotation: 16, scale: 0.75 },
    { x: -280, y: 95, rotation: 12, scale: 0.7 },
    { x: 85, y: 90, rotation: -10, scale: 0.55 },
    { x: 340, y: 70, rotation: -8, scale: 0.6 },
  ];
  pieces.forEach((pose, i) => {
    const target = `#piece-${i}`;
    enter(
      target,
      { ...pose, opacity: 0 },
      { ...pose, opacity: 1, duration: 0.24 },
      cue("impact", "second") + i * 0.055,
    );
    tl.to(
      target,
      { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.95, ease: "power3.inOut" },
      cue("impact", "converge") + i * 0.07,
    );
    tl.to(
      target,
      { backgroundColor: config.palette.signal, duration: 0.3 },
      cue("impact", "resolve"),
    );
  });
  tl.to("#impact-outline", { opacity: 0, duration: 0.2 }, cue("impact", "resolve"));
  enter(
    "#impact-solid",
    { opacity: 0 },
    { opacity: 1, duration: 0.15 },
    cue("impact", "resolve") + 0.3,
  );
  // The rectangle compresses to the stroke which introduces the brand.
  tl.to(
    "#impact-solid",
    { scaleX: 0.09, scaleY: 1.19, rotation: -39, duration: 0.55, ease: "power3.inOut" },
    scenes.impact.start + scenes.impact.duration - 0.55,
  );

  // Crossing paths become a distinct X. The 26s cut preserves the exact lockup.
  enter(
    "#reveal-stroke-a",
    { x: -140, y: 65, rotation: 51, scaleX: 0, opacity: 1 },
    { x: 0, y: 0, rotation: 51, scaleX: 1, opacity: 1, duration: 0.62, ease: "power3.inOut" },
    cue("reveal", "strokeA"),
  );
  enter(
    "#reveal-stroke-b",
    { x: 120, y: 65, rotation: -51, scaleX: 0, opacity: 1 },
    { x: 0, y: 0, rotation: -51, scaleX: 1, opacity: 1, duration: 0.6, ease: "power3.inOut" },
    cue("reveal", "strokeB"),
  );
  enter(
    "#reveal-word",
    { y: 58, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.62, ease: "power3.out" },
    cue("reveal", "word"),
  );
  enter(
    "#reveal-baseline",
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 0.5, duration: 0.58, ease: "power2.inOut" },
    cue("reveal", "lock"),
  );
  tl.to("#reveal-baseline", { opacity: 0, duration: 0.35 }, scenes.reveal.start + 2.5);

  // A quiet final reading window: the complete promise holds for 3.5 seconds.
  enter(
    "#final-tagline",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.38, ease: "power2.out" },
    cue("finale", "tagline"),
  );
  enter(
    "#final-rule",
    { scaleX: 0, opacity: 1 },
    { scaleX: 1, opacity: 1, duration: 0.38, ease: "power3.out" },
    cue("finale", "rule"),
  );

  return tl;
};
