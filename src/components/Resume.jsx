// src/components/Resume.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Plus, Trash2, Save, User, Download, Mail, Phone, MapPin, Code, Star } from 'lucide-react';
import client from '../api/client'; 
import '../App.css'; 

export default function Resume() {
    const [editMode, setEditMode] = useState(false);
    const resumeRef = useRef(null);

    // --- DATOS INICIALES y CARGA DE DATOS ---
    const [profile, setProfile] = useState({
        name: 'Stéfano Espinosa Castro',
        title: 'Desarrollador en Software',
        email: 'stefojc14sc06@hotmail.com',
        phone: '+593 99 835 8412',
        location: 'Quito, Ecuador',
        summary: 'Estudiante en curso de tecnología en Software en la PUCE, apasionado por el desarrollo de soluciones digitales y la creación de contenido multimedia, manejo de herramientas de programación, dispuesto al aprendizaje continuo y trabajo en equipo.',
        photo: ''
    });

    const [experience, setExperience] = useState([]);
    const [expLoading, setExpLoading] = useState(true);

    useEffect(() => {
        // Carga la experiencia desde la API usando Axios
        client.get('/experiencia')
            .then(response => {
                setExperience(response.data);
                setExpLoading(false);
            })
            .catch(err => {
                console.error("Error cargando experiencia:", err);
                setExpLoading(false);
            });
    }, []);

    const [education, setEducation] = useState([
        { id: 1, degree: 'Tecnología en Software - En Curso', institution: 'Pontificia Universidad Católica del Ecuador (PUCE)', period: '2024 - 2026', description: 'Tercer Semestre - Especialización en Desarrollo de Software' }
    ]);
    const [projects, setProjects] = useState([
        { id: 1, name: 'Certificación de Cédulas', period: 'Primer Semestre', description: 'Desarrollo de proyecto académico' },
        { id: 2, name: 'Tienda Virtual - Boxeo', period: 'Segundo Semestre', description: 'Desarrollo de proyecto académico' }
    ]);
    const [skills, setSkills] = useState([
        { id: 1, name: 'Python', level: 70 }, { id: 2, name: 'HTML/CSS', level: 65 }, { id: 3, name: 'Java', level: 60 }, 
        { id: 4, name: 'Django', level: 55 }, { id: 5, name: 'SQL/Database', level: 60 }, { id: 6, name: 'Diseño Digital (Canva)', level: 75 },
        { id: 7, name: 'Redes Sociales', level: 80 }, { id: 8, name: 'Inglés', level: 60 }
    ]);
    const [references, setReferences] = useState([
        { id: 1, name: 'Mike Espinosa', position: 'Supervisor de Nestlé Ecuador', phone: '0992718041' },
        { id: 2, name: 'Yesenia Castro', position: 'Agente Inmobiliario ExP Ecuador', phone: '0995648782' }
    ]);

    // --- FUNCIONES DE MANEJO DE ESTADO (Sin cambios) ---
    const handleProfileChange = (field, value) => setProfile({ ...profile, [field]: value });
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfile({ ...profile, photo: reader.result });
            reader.readAsDataURL(file);
        }
    };
    const downloadPDF = () => window.print();

    // Las funciones CRUD (addItem, updateItem, deleteItem) y sus wrappers deben estar aquí.

    const addItem = (setState, template) => setState(prevItems => [...prevItems, { id: Date.now(), ...template }]);
    const updateItem = (setState, id, field, value) => setState(prevItems => prevItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    const deleteItem = (setState, id) => setState(prevItems => prevItems.filter(item => item.id !== id));

    const addExperience = () => addItem(setExperience, { position: 'Nuevo Cargo', company: 'Empresa', period: '2024 - Presente', description: 'Descripción de responsabilidades' });
    const updateExperience = (id, field, value) => updateItem(setExperience, id, field, value);
    const deleteExperience = (id) => deleteItem(setExperience, id);

    const addEducation = () => addItem(setEducation, { degree: 'Título', institution: 'Institución', period: '2024', description: 'Descripción' });
    const updateEducation = (id, field, value) => updateItem(setEducation, id, field, value);
    const deleteEducation = (id) => deleteItem(setEducation, id);

    const addProject = () => addItem(setProjects, { name: 'Nuevo Proyecto', period: '2024', description: 'Descripción del proyecto' });
    const updateProject = (id, field, value) => updateItem(setProjects, id, field, value);
    const deleteProject = (id) => deleteItem(setProjects, id);

    const addSkill = () => addItem(setSkills, { name: 'Nueva Habilidad', level: 50 });
    const updateSkill = (id, field, value) => updateItem(setSkills, id, field, value);
    const deleteSkill = (id) => deleteItem(setSkills, id);

    const addReference = () => addItem(setReferences, { name: 'Nombre Completo', position: 'Cargo', phone: 'Teléfono' });
    const updateReference = (id, field, value) => updateItem(setReferences, id, field, value);
    const deleteReference = (id) => deleteItem(setReferences, id);

    // --- RENDERIZADO DEL COMPONENTE (Nueva Estructura de Dos Columnas) ---
    return (
        <div className="app-container">
            <div className="content-wrapper">
                
                {/* Botones de Control */}
                <div className="edit-control no-print">
                    <button onClick={downloadPDF} className="btn-download">
                        <Download size={18} /> Descargar PDF
                    </button>
                    <button onClick={() => setEditMode(!editMode)} className={`btn-edit ${editMode ? 'btn-save' : ''}`}>
                        {editMode ? (<><Save size={18} /> Guardar Cambios</>) : (<><Edit2 size={18} /> Modo Edición</>)}
                    </button>
                </div>

                {/* Tarjeta del Currículum */}
                <div className="resume-card two-column-layout" ref={resumeRef}>
                    
                    {/* COLUMNA IZQUIERDA (SIDEBAR) */}
                    <div className="sidebar-column">
                        
                        {/* FOTO y NOMBRE (EN EL SIDEBAR) */}
                        <div className="profile-header-sidebar">
                            <div className="photo-container-sidebar">
                                <div className="photo-circle-sidebar">
                                    {profile.photo ? (<img src={profile.photo} alt="Profile" className="photo-img" />) : (<User size={48} className="photo-placeholder" />)}
                                </div>
                                {editMode && (
                                    <label className="photo-edit-btn no-print">
                                        <Edit2 size={16} />
                                        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                                    </label>
                                )}
                            </div>
                            <div className="profile-info-sidebar">
                                {editMode ? (
                                    <>
                                        <input type="text" value={profile.name} onChange={(e) => handleProfileChange('name', e.target.value)} className="input-name-sidebar" placeholder="Nombre completo" />
                                        <input type="text" value={profile.title} onChange={(e) => handleProfileChange('title', e.target.value)} className="input-title-sidebar" placeholder="Título profesional" />
                                    </>
                                ) : (
                                    <>
                                        <h1 className="profile-name-sidebar">{profile.name}</h1>
                                        <p className="profile-title-sidebar">{profile.title}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* SECCIÓN CONTACTO */}
                        <section className="section sidebar-section contact-section">
                            <h2 className="section-title-sidebar"><Mail size={16}/> Contacto</h2>
                            <div className="contact-info-list">
                                {editMode ? (
                                    <>
                                        <input type="email" value={profile.email} onChange={(e) => handleProfileChange('email', e.target.value)} className="input-contact" placeholder="Email" />
                                        <input type="tel" value={profile.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} className="input-contact" placeholder="Teléfono" />
                                        <input type="text" value={profile.location} onChange={(e) => handleProfileChange('location', e.target.value)} className="input-contact" placeholder="Ubicación" />
                                    </>
                                ) : (
                                    <>
                                        <p><Mail size={16} className="contact-icon"/> {profile.email}</p>
                                        <p><Phone size={16} className="contact-icon"/> {profile.phone}</p>
                                        <p><MapPin size={16} className="contact-icon"/> {profile.location}</p>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* SECCIÓN HABILIDADES */}
                        <section className="section sidebar-section skills-section">
                            <div className="section-header-sidebar">
                                <h2 className="section-title-sidebar"><Code size={16}/> Habilidades</h2>
                                {editMode && (<button onClick={addSkill} className="btn-add-sidebar no-print"><Plus size={16} /></button>)}
                            </div>
                            <div className="skills-list">
                                {skills.map((skill) => (
                                    <div key={skill.id} className="skill-item-sidebar">
                                        {editMode && (<button onClick={() => deleteSkill(skill.id)} className="btn-delete-skill no-print"><Trash2 size={12} /></button>)}
                                        {editMode ? (
                                            <div className="skill-edit-sidebar">
                                                <input type="text" value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} className="input-skill-name" placeholder="Habilidad" />
                                                <div className="skill-slider">
                                                    <input type="range" min="0" max="100" value={skill.level} onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))} className="range-input" />
                                                    <span className="skill-percent">{skill.level}%</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="skill-name">{skill.name}</span>
                                                <div className="skill-bar-container-sidebar">
                                                    <div className="skill-bar-sidebar" style={{ width: `${skill.level}%` }} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SECCIÓN REFERENCIAS */}
                        <section className="section sidebar-section references-section">
                            <div className="section-header-sidebar">
                                <h2 className="section-title-sidebar"><Star size={16}/> Referencias</h2>
                                {editMode && (<button onClick={addReference} className="btn-add-sidebar no-print"><Plus size={16} /></button>)}
                            </div>
                            <div className="references-list">
                                {references.map((ref) => (
                                    <div key={ref.id} className="reference-item-sidebar">
                                        {editMode && (<button onClick={() => deleteReference(ref.id)} className="btn-delete-ref no-print"><Trash2 size={12} /></button>)}
                                        {editMode ? (
                                            <>
                                                <input type="text" value={ref.name} onChange={(e) => updateReference(ref.id, 'name', e.target.value)} className="input-ref-name" placeholder="Nombre" />
                                                <input type="text" value={ref.position} onChange={(e) => updateReference(ref.id, 'position', e.target.value)} className="input-ref-position" placeholder="Cargo" />
                                                <input type="text" value={ref.phone} onChange={(e) => updateReference(ref.id, 'phone', e.target.value)} className="input-ref-phone" placeholder="Teléfono" />
                                            </>
                                        ) : (
                                            <>
                                                <h4 className="ref-name">{ref.name}</h4>
                                                <p className="ref-position">{ref.position}</p>
                                                <p className="ref-phone">📱 {ref.phone}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* COLUMNA DERECHA (CONTENIDO PRINCIPAL) */}
                    <div className="main-content-column">
                        
                        {/* SECCIÓN SOBRE MÍ */}
                        <section className="section main-section">
                            <h2 className="section-title-main">Perfil Profesional</h2>
                            {editMode ? (<textarea value={profile.summary} onChange={(e) => handleProfileChange('summary', e.target.value)} className="textarea-summary" rows="4" placeholder="Resumen profesional" />) : (<p className="summary-text">{profile.summary}</p>)}
                        </section>

                        {/* SECCIÓN EXPERIENCIA LABORAL */}
                        <section className="section main-section">
                            <div className="section-header-main">
                                <h2 className="section-title-main">Experiencia Laboral</h2>
                                {editMode && (<button onClick={addExperience} className="btn-add-main no-print"><Plus size={18} /> Agregar</button>)}
                            </div>
                            <div className="items-container">
                                {expLoading ? (
                                    <p>Cargando experiencia profesional desde la API...</p>
                                ) : (
                                    experience.map((exp) => (
                                        <div key={exp.id} className="item experience-item">
                                            {editMode && (<button onClick={() => deleteExperience(exp.id)} className="btn-delete-main no-print"><Trash2 size={14} /></button>)}
                                            {editMode ? (
                                                <>
                                                    <input type="text" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="input-item-title" placeholder="Cargo" />
                                                    <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="input-item-subtitle" placeholder="Empresa" />
                                                    <input type="text" value={exp.period} onChange={(e) => updateExperience(exp.id, 'period', e.target.value)} className="input-item-period" placeholder="Período" />
                                                    <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className="input-item-desc" rows="2" placeholder="Descripción" />
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="item-title">{exp.position}</h3>
                                                    <p className="item-company">{exp.company}</p>
                                                    <p className="item-period">{exp.period}</p>
                                                    <p className="item-description">{exp.description}</p>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* SECCIÓN FORMACIÓN ACADÉMICA */}
                        <section className="section main-section">
                            <div className="section-header-main">
                                <h2 className="section-title-main">Formación Académica</h2>
                                {editMode && (<button onClick={addEducation} className="btn-add-main no-print"><Plus size={18} /> Agregar</button>)}
                            </div>
                            <div className="items-container">
                                {education.map((edu) => (
                                    <div key={edu.id} className="item education-item">
                                        {editMode && (<button onClick={() => deleteEducation(edu.id)} className="btn-delete-main no-print"><Trash2 size={14} /></button>)}
                                        {editMode ? (
                                            <>
                                                <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="input-item-title" placeholder="Título" />
                                                <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="input-item-subtitle education-subtitle" placeholder="Institución" />
                                                <input type="text" value={edu.period} onChange={(e) => updateEducation(edu.id, 'period', e.target.value)} className="input-item-period" placeholder="Período" />
                                                <textarea value={edu.description} onChange={(e) => updateEducation(edu.id, 'description', e.target.value)} className="input-item-desc" rows="2" placeholder="Descripción" />
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="item-title">{edu.degree}</h3>
                                                <p className="item-institution">{edu.institution}</p>
                                                <p className="item-period">{edu.period}</p>
                                                <p className="item-description">{edu.description}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SECCIÓN PROYECTOS */}
                        <section className="section main-section">
                            <div className="section-header-main">
                                <h2 className="section-title-main">Experiencia Académica - Proyectos</h2>
                                {editMode && (<button onClick={addProject} className="btn-add-main no-print"><Plus size={18} /> Agregar</button>)}
                            </div>
                            <div className="items-container">
                                {projects.map((proj) => (
                                    <div key={proj.id} className="item project-item">
                                        {editMode && (<button onClick={() => deleteProject(proj.id)} className="btn-delete-main no-print"><Trash2 size={14} /></button>)}
                                        {editMode ? (
                                            <>
                                                <input type="text" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} className="input-item-title" placeholder="Nombre del Proyecto" />
                                                <input type="text" value={proj.period} onChange={(e) => updateProject(proj.id, 'period', e.target.value)} className="input-item-period" placeholder="Período" />
                                                <textarea value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} className="input-item-desc" rows="2" placeholder="Descripción" />
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="item-title">{proj.name}</h3>
                                                <p className="item-period">{proj.period}</p>
                                                <p className="item-description">{proj.description}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div> {/* Fin Main Content Column */}

                </div> {/* Fin Resume Card */}
            </div>
        </div>
    );
}