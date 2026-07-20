import { Cloud, Code2, Database, Network, Server, ArrowUpRight, Award, ShieldCheck } from 'lucide-react';

export default function SkillsPage() {
  return (
    <section className="skills-section" id="skills">
      <div className="skills-container">
        <div className="skills-header">
          <span className="section-kicker">Compétences techniques</span>
          <h2>Expertise & Technologies</h2>
          <p>Un ensemble de compétences couvrant le Cloud, les réseaux et le développement moderne</p>
        </div>

        <div className="skills-grid">
          <div className="skill-category-card">
            <div className="category-header">
              <div className="category-icon">
                <Cloud size={32} />
              </div>
              <h3>Cloud & DevOps</h3>
              <p>Infrastructure cloud et automatisation</p>
            </div>

            <div className="skills-subgroup">
              <h4 className="subgroup-title">Cloud</h4>
              <div className="skills-list">
                <div className="skill-item">
                  <Cloud size={18} />
                  <span>AWS</span>
                </div>
                <div className="skill-item">
                  <Database size={18} />
                  <span>S3</span>
                </div>
                <div className="skill-item">
                  <Server size={18} />
                  <span>EC2</span>
                </div>
                <div className="skill-item">
                  <Network size={18} />
                  <span>CloudFront</span>
                </div>
                <div className="skill-item">
                  <Code2 size={18} />
                  <span>Lambda</span>
                </div>
                <div className="skill-item">
                  <Database size={18} />
                  <span>CloudFormation</span>
                </div>
              </div>
            </div>

            <div className="skills-subgroup">
              <h4 className="subgroup-title">DevOps</h4>
              <div className="skills-list">
                <div className="skill-item">
                  <Server size={18} />
                  <span>Docker</span>
                </div>
                <div className="skill-item">
                  <Code2 size={18} />
                  <span>Jenkins</span>
                </div>
                <div className="skill-item">
                  <ArrowUpRight size={18} />
                  <span>CI/CD</span>
                </div>
                <div className="skill-item">
                  <Database size={18} />
                  <span>Terraform</span>
                </div>
                <div className="skill-item">
                  <Award size={18} />
                  <span>CloudWatch</span>
                </div>
              </div>
            </div>
          </div>

          <div className="skill-category-card">
            <div className="category-header">
              <div className="category-icon">
                <Network size={32} />
              </div>
              <h3>Réseaux & Systèmes</h3>
              <p>Architecture réseau et administration</p>
            </div>
            <div className="skills-list">
              <div className="skill-item">
                <Network size={18} />
                <span>VLAN</span>
              </div>
              <div className="skill-item">
                <ArrowUpRight size={18} />
                <span>Routage</span>
              </div>
              <div className="skill-item">
                <ShieldCheck size={18} />
                <span>ACL</span>
              </div>
              <div className="skill-item">
                <Network size={18} />
                <span>TCP/IP</span>
              </div>
              <div className="skill-item">
                <Code2 size={18} />
                <span>Bash</span>
              </div>
              <div className="skill-item">
                <Server size={18} />
                <span>Administration Linux</span>
              </div>
            </div>
          </div>

          <div className="skill-category-card">
            <div className="category-header">
              <div className="category-icon">
                <Code2 size={32} />
              </div>
              <h3>Développement Web</h3>
              <p>Applications web full-stack modernes</p>
            </div>
            <div className="skills-list">
              <div className="skill-item">
                <Code2 size={18} />
                <span>HTML</span>
              </div>
              <div className="skill-item">
                <Code2 size={18} />
                <span>CSS</span>
              </div>
              <div className="skill-item">
                <Code2 size={18} />
                <span>Tailwind CSS</span>
              </div>
              <div className="skill-item">
                <Code2 size={18} />
                <span>JavaScript</span>
              </div>
              <div className="skill-item">
                <Code2 size={18} />
                <span>React</span>
              </div>
              <div className="skill-item">
                <Server size={18} />
                <span>Node.js</span>
              </div>
              <div className="skill-item">
                <Server size={18} />
                <span>Express</span>
              </div>
              <div className="skill-item">
                <Database size={18} />
                <span>MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
